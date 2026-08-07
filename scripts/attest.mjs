// Attest a real XRPL testnet payment and dump the finalized proof as JSON.
//
// Usage:
//   TX_HASH=0x... PROOF_OWNER=0x... RELAYER_PK=0x... node attest.mjs
//
// The FDC v1.3 flow has four steps, each verifiable on its own:
//   1. prepareRequest on the Flare-hosted verifier -> abiEncodedRequest
//   2. requestAttestation(bytes) on FdcHub (payable, 1000 wei) -> tx
//   3. voting round for the submission block via the relay's
//      getVotingRoundId(uint256 timestamp)
//   4. poll the Coston2 DA for the finalized proof, write proof.json
//
// PROOF_OWNER must be the contract that will call verifyXRPPayment
// (the registry). The proof is bound to that address.
import "dotenv/config";
import fs from "node:fs";
import {
  createPublicClient,
  createWalletClient,
  http,
  keccak256,
  parseAbi,
  defineChain,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

const env = process.env;
const txHash = env.TX_HASH;
const proofOwner = env.PROOF_OWNER;
const relayerPk = env.RELAYER_PK;
if (!txHash || !proofOwner || !relayerPk) {
  console.error("TX_HASH, PROOF_OWNER and RELAYER_PK required (RELAYER_PK pays the requestAttestation fee)");
  process.exit(1);
}

const chain = defineChain({
  id: 114,
  name: "Coston2",
  network: "coston2",
  nativeCurrency: { name: "C2FLR", symbol: "C2FLR", decimals: 18 },
  rpcUrls: { default: { http: [env.COSTON2_RPC || "https://coston2-api.flare.network/ext/C/rpc"] } },
});

const FDC_HUB = env.FDC_HUB || "0x48aC463d7975828989331F4De43341627b9c5f1D";
const RELAY = env.FDC_RELAY || "0xa10B672D1c62e5457b17af63d4302add6A99d7dE";
const VERIFIER_URL = env.FDC_VERIFIER_URL || "https://fdc-verifiers-testnet.flare.network";
const VERIFIER_KEY = env.FDC_VERIFIER_KEY || "00000000-0000-0000-0000-000000000000";
const DA_URL = env.FDC_DA_URL || "https://ctn2-data-availability.flare.network";
const SOURCE_ID = env.FDC_SOURCE_ID || "testXRP";

const pad32 = (s) => "0x" + Buffer.from(s, "utf8").toString("hex").padEnd(64, "0");
const attType = pad32("XRPPayment");
const sourceId = pad32(SOURCE_ID);

const account = privateKeyToAccount(relayerPk);
const wallet = createWalletClient({ account, chain, transport: http() });
const publicClient = createPublicClient({ chain, transport: http() });

const transactionId = txHash.startsWith("0x") ? txHash : `0x${txHash}`;

console.error(`[attest] 1/4 prepareRequest (tx ${transactionId.slice(0, 18)}…, owner ${proofOwner})`);
const prepRes = await fetch(`${VERIFIER_URL}/verifier/xrp/XRPPayment/prepareRequest`, {
  method: "POST",
  headers: { "content-type": "application/json", "x-api-key": VERIFIER_KEY },
  body: JSON.stringify({ attestationType: attType, sourceId, requestBody: { transactionId, proofOwner } }),
});
const prep = await prepRes.json();
if (!prep.abiEncodedRequest) {
  console.error("[attest] prepare failed:", prep);
  process.exit(1);
}
const abiEncodedRequest = prep.abiEncodedRequest;
const requestId = keccak256(abiEncodedRequest);
console.error(`[attest] prepared, status=${prep.status} requestId=${requestId.slice(0, 18)}…`);

console.error("[attest] 2/4 requestAttestation on FdcHub (1000 wei fee)");
const FDC_ABI = parseAbi([
  "function requestAttestation(bytes calldata abiEncodedRequest) external payable returns (bytes32 requestId)",
]);
const tx = await wallet.writeContract({
  address: FDC_HUB,
  abi: FDC_ABI,
  functionName: "requestAttestation",
  args: [abiEncodedRequest],
  value: 1000n,
});
const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
console.error(`[attest] requestAttestation tx ${tx.slice(0, 18)}… status=${receipt.status}`);
if (receipt.status !== "success") process.exit(1);

console.error("[attest] 3/4 voting round for submission block");
const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber });
const round = await publicClient.readContract({
  address: RELAY,
  abi: parseAbi(["function getVotingRoundId(uint256 timestamp) view returns (uint256)"]),
  functionName: "getVotingRoundId",
  args: [block.timestamp],
});
console.error(`[attest] round for block ${receipt.blockNumber} ts=${block.timestamp} = ${round}`);

// The submission lands at the end of a round and is voted on in the next one.
// Try the computed round and the following one.
const deadline = Date.now() + 8 * 60 * 1000;
let found = null;
for (const rnd of [round, round + 1n]) {
  console.error(`[attest] 4/4 polling DA round ${rnd}`);
  while (Date.now() < deadline) {
    const res = await fetch(`${DA_URL}/api/v1/fdc/proof-by-request-round`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": VERIFIER_KEY },
      body: JSON.stringify({ votingRoundId: rnd.toString(), requestBytes: abiEncodedRequest }),
    });
    if (res.status === 200) {
      const body = await res.json();
      if (body.proof && body.response) {
        found = body;
        console.error(`[attest] PROOF READY round ${rnd} votingRound=${body.response.votingRound}`);
        break;
      }
    }
    await new Promise((r) => setTimeout(r, 20000));
  }
  if (found) break;
}

if (!found) {
  console.error("[attest] no proof within timeout — the round may need more time; re-run to poll again");
  process.exit(1);
}

fs.writeFileSync("proof.json", JSON.stringify(found, null, 2));
console.error("[attest] wrote proof.json");
