// Servo strategy agent.
// Every tick: (1) refreshes the realized-yield report, (2) loads active due
// orders, (3) scores venues with a confidence derived from data freshness and
// sample count, (4) executes when confidence >= threshold and the order is
// autoExecute, otherwise logs that a signature is required.
//
// Strategy 1 (default): route to the venue with the highest realized APY.

import "dotenv/config";
import { createPublicClient, createWalletClient, http, parseAbi } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";
import { index } from "./indexer.mjs";

const env = process.env;
const THRESHOLD = Number(env.AGENT_CONFIDENCE_THRESHOLD || 70);
const TICK_MS = Number(env.AGENT_TICK_MS || 60_000);

if (!env.SERVO_REGISTRY || !env.SERVO_CONTROLLER || !env.RELAYER_PK || !env.COSTON2_RPC) {
  console.error(
    "missing env: SERVO_REGISTRY, SERVO_CONTROLLER, RELAYER_PK, COSTON2_RPC (see ../.env.example)"
  );
  process.exit(1);
}

const CHAIN = defineChain({
  id: Number(env.SERVO_CHAIN_ID || 114),
  name: "Coston2",
  network: "coston2",
  nativeCurrency: { name: "Coston2 FLR", symbol: "C2FLR", decimals: 18 },
  rpcUrls: { default: { http: [env.COSTON2_RPC] } },
});
const publicClient = createPublicClient({ chain: CHAIN, transport: http(env.COSTON2_RPC) });
const account = privateKeyToAccount(env.RELAYER_PK);
const wallet = createWalletClient({ account, chain: CHAIN, transport: http(env.COSTON2_RPC) });

const ABI = parseAbi([
  "function getOrder(uint256) view returns ((bytes32 ownerXrpl,address ownerEvm,uint64 amountDrops,uint32 cadenceSeconds,uint8 venueId,uint8 strategyId,bool autoExecute,bool active,uint64 nextExecutionAt,uint64 lastExecutedAt,uint64 totalExecutedDrops,uint32 executionCount))",
  "function orderCount() view returns (uint256)",
]);
const CONTROLLER_ABI = parseAbi([
  "function execute(uint256) returns (bool)",
  "event ExecutionReceipt(uint256 indexed orderId,bytes32 indexed ownerXrpl,uint64 amountDrops,uint256 priceXrpUsd,uint8 venueId,address venueAdapter,bytes32 transactionId,uint256 timestamp)",
]);

const REGISTRY = env.SERVO_REGISTRY;
const CONTROLLER = env.SERVO_CONTROLLER;

/** Confidence from data quality: sample count + recency (0..100). */
function confidence(report) {
  if (!report || report.samples === 0) return 0;
  const ageDays = (Date.now() / 1000 - report.lastSampleTs) / 86400;
  const countScore = Math.min(report.samples / 30, 1) * 50;
  const freshScore = Math.max(0, 1 - ageDays / 7) * 50;
  return Math.round(countScore + freshScore);
}

function bestVenue(report, order) {
  // venue 0 (hold) is always a candidate with 0 APY
  const candidates = Object.values(report);
  candidates.push({ venueId: 0, name: "FXRP (hold)", apy30: 0, apy7: 0, samples: 0, lastSampleTs: 0 });
  const sorted = [...candidates].sort((a, b) => (b.apy30 ?? 0) - (a.apy30 ?? 0));
  const best = sorted[0];
  const current = candidates.find((c) => c.venueId === order.venueId) ?? { venueId: 0, apy30: 0 };
  return { best, current, switchUp: (best.apy30 ?? 0) > (current.apy30 ?? 0) + 0.05 };
}

async function tick() {
  console.log(`\n[agent] tick ${new Date().toISOString()} (threshold ${THRESHOLD}%)`);
  const report = await index();
  const n = Number(await publicClient.readContract({ address: REGISTRY, abi: ABI, functionName: "orderCount" }));

  for (let id = 1n; id <= n; id++) {
    const o = await publicClient.readContract({ address: REGISTRY, abi: ABI, functionName: "getOrder", args: [id] });
    if (!o.active) continue;
    const due = Number(o.nextExecutionAt) <= Math.floor(Date.now() / 1000);
    if (!due) continue;

    const { best, current, switchUp } = bestVenue(report, o);
    const conf = confidence(best);
    const decision = {
      orderId: Number(id),
      currentVenue: current.name,
      bestVenue: best.name,
      bestApy30: best.apy30,
      switchUp,
      confidence: conf,
      autoExecute: o.autoExecute,
    };

    if (switchUp && conf >= THRESHOLD && o.autoExecute) {
      try {
        const tx = await wallet.writeContract({
          address: CONTROLLER, abi: CONTROLLER_ABI, functionName: "execute", args: [id],
        });
        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log(`[agent] EXECUTED order ${Number(id)} -> ${best.name} tx=${tx} status=${receipt.status}`);
      } catch (e) {
        console.log(`[agent] execute failed order ${Number(id)}: ${e.shortMessage ?? e.message}`);
      }
    } else {
      const reason = !switchUp ? "current venue already best"
        : conf < THRESHOLD ? `confidence ${conf}% < ${THRESHOLD}%`
        : "order requires signature (autoExecute=false)";
      console.log(`[agent] order ${Number(id)}: ${reason} — routing ${current.name} -> ${best.name} would need one signature`);
    }
  }
}

async function main() {
  if (!REGISTRY || !CONTROLLER || !env.RELAYER_PK) {
    console.error("missing env: SERVO_REGISTRY, SERVO_CONTROLLER, RELAYER_PK");
    process.exit(1);
  }
  console.log(`[agent] watching registry ${REGISTRY} controller ${CONTROLLER}`);
  await tick();
  setInterval(tick, TICK_MS);
}

main().catch((e) => { console.error("[agent] fatal:", e); process.exit(1); });
