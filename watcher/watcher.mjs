// Servo watcher: watches an XRPL address for payments carrying a Servo memo,
// requests an FDC XRPPayment attestation for each, and registers the
// standing order on-chain (StandingOrderRegistry.registerOrder).

import "dotenv/config";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client, dropsToXrp } from "xrpl";
import { createWalletClient, createPublicClient, http as httpTransport, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";
import { FdcClient } from "./fdc-client.mjs";

const env = process.env;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- replay protection: seen transactions survive restarts ---------------
const STATE_DIR = path.join(__dirname, "state");
const STATE_FILE = path.join(STATE_DIR, "seen-txs.json");
const state = { seen: {}, lastPaymentAt: 0, registered: {} };
try {
  Object.assign(state, JSON.parse(fs.readFileSync(STATE_FILE, "utf8")));
} catch {
  fs.mkdirSync(STATE_DIR, { recursive: true });
}
function flushState() {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}
const startedAt = Date.now();

// --- config ---
const COSTON2 = defineChain({
  id: Number(env.SERVO_CHAIN_ID || 114),
  name: "Coston2",
  network: "coston2",
  nativeCurrency: { name: "Coston2 FLR", symbol: "C2FLR", decimals: 18 },
  rpcUrls: { default: { http: [env.COSTON2_RPC] } },
});
const relayer = privateKeyToAccount(env.RELAYER_PK);
const publicClient = createPublicClient({ chain: COSTON2, transport: httpTransport(env.COSTON2_RPC) });
const wallet = createWalletClient({ account: relayer, chain: COSTON2, transport: httpTransport(env.COSTON2_RPC) });

const REGISTRY_ABI = parseAbi([
  "function registerOrder((bytes32[] merkleProof,(bytes32 attestationType,bytes32 sourceId,uint64 votingRound,uint64 lowestUsedTimestamp,(bytes32 transactionId,address proofOwner) requestBody,(uint64 blockNumber,uint64 blockTimestamp,string sourceAddress,bytes32 sourceAddressHash,bytes32 receivingAddressHash,bytes32 intendedReceivingAddressHash,int256 spentAmount,int256 intendedSpentAmount,int256 receivedAmount,int256 intendedReceivedAmount,bool hasMemoData,bytes firstMemoData,bool hasDestinationTag,uint256 destinationTag,uint8 status) responseBody) data,bytes32 salt) proof,address ownerEvm) returns (uint256 orderId)",
  "function orderCount() view returns (uint256)",
]);

const fdc = new FdcClient({
  verifierUrl: env.FDC_VERIFIER_URL,
  verifierKey: env.FDC_VERIFIER_KEY,
  daUrl: env.FDC_DA_URL || "https://ctn2-data-availability.flare.network",
  sourceId: env.FDC_SOURCE_ID,
});

const REGISTRY = env.SERVO_REGISTRY;
const OWNER_EVM = env.OWNER_EVM;
const WATCH_ADDRESS = env.XRPL_RECEIVING_ADDRESS;
const DEST_TAG = env.XRPL_DESTINATION_TAG ? Number(env.XRPL_DESTINATION_TAG) : null;

const SERVO_MEMO_PREFIX = "5352"; // hex of "SR"

function memoLooksLikeServo(memoDataHex) {
  return typeof memoDataHex === "string" && memoDataHex.toLowerCase().startsWith(SERVO_MEMO_PREFIX);
}

function findServoMemo(tx) {
  const memos = tx?.Memos || [];
  for (const m of memos) {
    const data = m.Memo?.MemoData;
    if (data && memoLooksLikeServo(data)) return data;
  }
  return null;
}

async function attestAndRegister(tx) {
  const txHash = tx.hash || tx.transaction_hash;
  console.log(`[watcher] payment ${txHash} from ${tx.Account} amount=${dropsToXrp(tx.Amount)} XRP tag=${tx.DestinationTag ?? "-"}`);
  if (!txHash) throw new Error("no tx hash");
  if (state.seen[txHash]) {
    console.log(`[watcher] ${txHash} already processed — skipping replay`);
    return state.registered[txHash] ?? "skipped";
  }
  state.seen[txHash] = Date.now();
  state.lastPaymentAt = Date.now();
  flushState();

  const prepared = await fdc.prepareXrpPayment(txHash, REGISTRY);
  console.log(`[watcher] attestation requested: requestId=${prepared.requestId} status=${prepared.status}`);
  if (prepared.status !== "OK") throw new Error(`prepare failed: ${prepared.status}`);

  const attestationType = FdcClient.ATTESTATION.xrpPayment;
  const final = await fdc.waitForFinalized(attestationType, prepared.requestId);
  console.log(`[watcher] attestation finalized (round ${final.attestationProof?.data?.votingRound ?? "?"})`);

  const proof = final.attestationProof;
  if (!proof) throw new Error("no attestationProof in response");

  const orderId = await wallet.writeContract({
    address: REGISTRY,
    abi: REGISTRY_ABI,
    functionName: "registerOrder",
    args: [proof, OWNER_EVM],
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash: orderId });
  console.log(`[watcher] order registered: tx=${orderId} status=${receipt.status}`);
  state.registered[txHash] = orderId;
  flushState();
  return orderId;
}

async function main() {
  if (!REGISTRY || !OWNER_EVM || !WATCH_ADDRESS || !env.RELAYER_PK) {
    console.error("missing env: SERVO_REGISTRY, OWNER_EVM, XRPL_RECEIVING_ADDRESS, RELAYER_PK");
    process.exit(1);
  }
  const count = await publicClient.readContract({ address: REGISTRY, abi: REGISTRY_ABI, functionName: "orderCount" });
  console.log(`[watcher] registry ${REGISTRY} has ${count} orders; watching ${WATCH_ADDRESS}${DEST_TAG ? ` tag=${DEST_TAG}` : " any tag"}`);

  const client = new Client(env.XRPL_WSS);
  await client.connect();
  console.log("[watcher] connected to XRPL");

  const handle = async (tx) => {
    try {
      if (tx.Account === WATCH_ADDRESS && tx.TransactionType === "Payment" && !tx.Destination) return; // self-sends ignore
      if (tx.Destination !== WATCH_ADDRESS) return;
      if (DEST_TAG !== null && Number(tx.DestinationTag) !== DEST_TAG) return;
      const memo = findServoMemo(tx);
      if (!memo) return; // not a Servo payment
      await attestAndRegister(tx);
    } catch (e) {
      console.error(`[watcher] error processing ${tx.hash}:`, e.message);
    }
  };

  client.on("transaction", handle);
  await client.request({
    command: "subscribe",
    accounts: [WATCH_ADDRESS],
  });
  console.log("[watcher] subscribed; waiting for Servo payments...");

  // --- /health endpoint ---------------------------------------------------
  const health = http.createServer(async (req, res) => {
    if (req.url !== "/health") {
      res.writeHead(404);
      res.end();
      return;
    }
    let orderCount = null;
    try {
      orderCount = Number(
        await publicClient.readContract({ address: REGISTRY, abi: REGISTRY_ABI, functionName: "orderCount" })
      );
    } catch {
      /* registry read failed */
    }
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({
        ok: true,
        uptimeSec: Math.round((Date.now() - startedAt) / 1000),
        connected: client.isConnected(),
        registry: REGISTRY,
        orderCount,
        seenPayments: Object.keys(state.seen).length,
        lastPaymentAt: state.lastPaymentAt ? new Date(state.lastPaymentAt).toISOString() : null,
      })
    );
  });
  health.listen(Number(env.WATCHER_PORT || 9100));
  console.log(`[watcher] health endpoint on :${env.WATCHER_PORT || 9100}/health`);

  // --- graceful shutdown --------------------------------------------------
  const shutdown = async () => {
    console.log("[watcher] shutting down...");
    health.close();
    try {
      await client.disconnect();
    } catch {
      /* already closed */
    }
    flushState();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((e) => {
  console.error("[watcher] fatal:", e);
  process.exit(1);
});
