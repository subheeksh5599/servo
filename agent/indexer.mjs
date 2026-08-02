// Servo realized-yield indexer.
// Reads each venue adapter's exchange rate on-chain, appends a sample to
// state/prices.json, and computes 7/30-day realized APY from the samples.
// No fabricated data: rates come from the deployed adapters (which read the
// real venue vaults); APY is computed from those same samples.

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPublicClient, http, parseAbi } from "viem";
import { defineChain } from "viem";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env;
const STATE_FILE = path.join(__dirname, "state", "prices.json");
const SECONDS_PER_DAY = 86400;

const CHAIN = defineChain({
  id: Number(env.SERVO_CHAIN_ID || 114),
  name: "Coston2",
  network: "coston2",
  nativeCurrency: { name: "Coston2 FLR", symbol: "C2FLR", decimals: 18 },
  rpcUrls: { default: { http: [env.COSTON2_RPC] } },
});
const publicClient = createPublicClient({ chain: CHAIN, transport: http(env.COSTON2_RPC) });

const ABI = parseAbi([
  "function getOrder(uint256) view returns ((bytes32 ownerXrpl,address ownerEvm,uint64 amountDrops,uint32 cadenceSeconds,uint8 venueId,uint8 strategyId,bool autoExecute,bool active,uint64 nextExecutionAt,uint64 lastExecutedAt,uint64 totalExecutedDrops,uint32 executionCount))",
  "function venueAdapters(uint8) view returns (address adapter,bool set)",
  "function orderCount() view returns (uint256)",
  "function exchangeRate() view returns (uint256)",
  "function venueName() view returns (string)",
]);

function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    return { venues: {}, samples: [] };
  }
}

function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function toApy(rateNow, ratePast, days) {
  if (!ratePast || ratePast === 0n) return 0;
  const growth = Number(rateNow) / Number(ratePast);
  const years = days / 365;
  if (years <= 0) return 0;
  return (Math.pow(growth, 1 / years) - 1) * 100; // % APY
}

async function collect() {
  const registry = env.SERVO_REGISTRY;
  const controller = env.SERVO_CONTROLLER;
  if (!registry || !controller) throw new Error("SERVO_REGISTRY and SERVO_CONTROLLER required");
  const venues = [];
  for (let v = 0; v <= 4; v++) {
    try {
      const [adapter, set] = await publicClient.readContract({
        address: controller, abi: ABI, functionName: "venueAdapters", args: [v],
      });
      if (!set) continue;
      const rate = await publicClient.readContract({
        address: adapter, abi: ABI, functionName: "exchangeRate",
      });
      const name = await publicClient.readContract({
        address: adapter, abi: ABI, functionName: "venueName",
      });
      venues.push({ venueId: v, adapter, name, rate: rate.toString() });
    } catch {
      // venue not configured
    }
  }
  return venues;
}

export async function index() {
  const venues = await collect();
  const state = loadState();
  const now = Math.floor(Date.now() / 1000);

  // append one sample per venue
  const sample = { ts: now, venues };
  state.samples.push(sample);
  state.samples = state.samples.filter((s) => now - s.ts < 45 * SECONDS_PER_DAY);

  // derive per-venue series
  const series = {};
  for (const s of state.samples) {
    for (const v of s.venues) {
      (series[v.venueId] ||= []).push({ ts: s.ts, rate: BigInt(v.rate) });
    }
  }

  const report = {};
  for (const [venueId, arr] of Object.entries(series)) {
    const latest = arr[arr.length - 1].rate;
    const findPast = (days) => {
      const cutoff = now - days * SECONDS_PER_DAY;
      const older = arr.filter((p) => p.ts <= cutoff);
      return older.length ? older[older.length - 1].rate : 0n;
    };
    const apy7 = toApy(latest, findPast(7), 7);
    const apy30 = toApy(latest, findPast(30), 30);
    const v = venues.find((x) => x.venueId === Number(venueId));
    report[venueId] = {
      venueId: Number(venueId),
      name: v?.name ?? `venue-${venueId}`,
      adapter: v?.adapter ?? null,
      rate: latest.toString(),
      apy7: Number(apy7.toFixed(4)),
      apy30: Number(apy30.toFixed(4)),
      samples: arr.length,
      lastSampleTs: arr[arr.length - 1].ts,
    };
  }

  state.report = report;
  state.updatedAt = now;
  saveState(state);
  return report;
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  index().then((r) => {
    for (const v of Object.values(r)) {
      console.log(`venue ${v.venueId} ${v.name}: rate=${v.rate} apy7=${v.apy7}% apy30=${v.apy30}% samples=${v.samples}`);
    }
  }).catch((e) => { console.error("[indexer]", e.message); process.exit(1); });
}
