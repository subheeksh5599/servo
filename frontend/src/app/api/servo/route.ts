import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Reads the deployed Servo registry on Coston2 via raw JSON-RPC (no client
// dependency). If SERVO_REGISTRY / SERVO_CONTROLLER are not set, honestly
// reports deployed:false · the dashboard shows real empty states.
const REGISTRY = process.env.SERVO_REGISTRY || "";
const CONTROLLER = process.env.SERVO_CONTROLLER || "";
const RPC = process.env.COSTON2_RPC || "https://coston2-api.flare.network/ext/C/rpc";

// selectors
const ORDER_COUNT = "0x85b2d9ce"; // orderCount()
const GET_ORDER =
  "0x3a69c05a"; // getOrder(uint256)
const VENUE_ADAPTERS = "0x6c1fe72d"; // venueAdapters(uint8)
const EXCHANGE_RATE = "0xe6aa216c"; // exchangeRate()
const VENUE_NAME = "0xae7725a4"; // venueName()
const EXECUTION_RECEIPT =
  "0x2a2e8ba6e0fdcab07ebd6a8b8f1d17e7f8a9b3c5d4e6f708192a3b4c5d6e7f80"; // topic0 placeholder

async function rpc(method: string, params: unknown[]) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result as string;
}

function encUint(v: number | bigint) {
  return "0x" + BigInt(v).toString(16).padStart(64, "0");
}

function call(to: string, data: string) {
  return rpc("eth_call", [{ to, data }, "latest"]);
}

function padLeft(hex: string, bytes = 32) {
  return "0x" + hex.slice(2).padStart(bytes * 2, "0");
}

export async function GET() {
  if (!REGISTRY) {
    return NextResponse.json({
      deployed: false,
      registry: null,
      controller: null,
      orders: [],
      venues: [],
      receipts: [],
      note: "SERVO_REGISTRY not configured · read-only view. Deploy (forge script script/Deploy.s.sol), then set SERVO_REGISTRY / SERVO_CONTROLLER to go live.",
    });
  }
  try {
    // orders
    const countHex = await call(REGISTRY, ORDER_COUNT);
    const count = Number(BigInt(countHex));
    const orders = [];
    for (let i = 1; i <= count; i++) {
      const raw = await call(REGISTRY, GET_ORDER + encUint(i));
      const h = raw.slice(2);
      // struct: ownerXrpl(32) ownerEvm(32) amountDrops(32) cadenceSeconds(32)
      // venueId(32) strategyId(32) autoExecute(32) active(32) nextExecutionAt(32)
      // lastExecutedAt(32) totalExecutedDrops(32) executionCount(32)
      const s = (off: number, bytes: number) =>
        "0x" + h.slice(off * 64, off * 64 + bytes * 2);
      const slot = (i: number) => Number(BigInt("0x" + h.slice(i * 64, i * 64 + 64)));
      const active = slot(7) === 1;
      const nextExecutionAt = slot(8);
      orders.push({
        id: i,
        ownerXrpl: s(0, 32),
        ownerEvm: "0x" + h.slice(32, 72),
        amountDrops: BigInt("0x" + h.slice(64, 128)).toString(),
        cadenceSeconds: slot(3),
        venueId: slot(4),
        strategyId: slot(5),
        autoExecute: slot(6) === 1,
        active,
        nextExecutionAt,
        lastExecutedAt: slot(9),
        totalExecutedDrops: BigInt("0x" + h.slice(320, 384)).toString(),
        executionCount: slot(11),
      });
    }

    // venues
    const venues = [];
    for (let v = 0; v <= 4; v++) {
      try {
        const raw = await call(CONTROLLER, VENUE_ADAPTERS + encUint(v));
        const h = raw.slice(2);
        const adapter = "0x" + h.slice(24, 64);
        const set = Number(BigInt("0x" + h.slice(64, 128))) === 1;
        if (!set || adapter === "0x" + "0".repeat(40)) continue;
        const rateHex = await call(adapter, EXCHANGE_RATE);
        const nameHex = await call(adapter, VENUE_NAME);
        const name = Buffer.from(nameHex.slice(2), "hex")
          .toString("utf8")
          .replace(/\u0000/g, "");
        venues.push({ venueId: v, adapter, name, rate: BigInt(rateHex).toString() });
      } catch {
        /* venue not configured */
      }
    }

    // receipts · ExecutionReceipt events from the controller
    const logsRes = await fetch(RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getLogs",
        params: [{ address: CONTROLLER, fromBlock: "0x0", toBlock: "latest" }],
      }),
    });
    const logsJson = await logsRes.json();
    const logs = (logsJson.result as any[] | undefined) ?? [];
    const receipts = logs
      .filter((l) => l.topics && l.topics.length >= 4)
      .slice(-100)
      .map((l) => ({
        orderId: Number(BigInt(l.topics[1])),
        ownerXrpl: l.topics[2],
        amountDrops: BigInt("0x" + l.data.slice(0, 64)).toString(),
        priceXrpUsd: BigInt("0x" + l.data.slice(64, 128)).toString(),
        venueId: Number(BigInt("0x" + l.data.slice(128, 192))),
        transactionId: "0x" + l.data.slice(192, 256),
        timestamp: Number(BigInt("0x" + l.data.slice(256, 320))),
        txHash: l.transactionHash,
      }));

    return NextResponse.json({
      deployed: true,
      registry: REGISTRY,
      controller: CONTROLLER,
      orders,
      venues,
      receipts,
    });
  } catch (e) {
    return NextResponse.json({
      deployed: true,
      error: (e as Error).message,
      orders: [],
      venues: [],
      receipts: [],
    });
  }
}
