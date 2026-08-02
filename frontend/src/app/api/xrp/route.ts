import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const RPC = process.env.FLARE_RPC || "https://flare-api.flare.network/ext/C/rpc";
const FTSOV2 =
  process.env.FLARE_FTSOV2 || "0x7bde3df0624114edb3a67dfe6753e62f4e7c1d20";
const DATA =
  "0x93e9f806" +
  "015852502f55534400000000000000000000000000" +
  "0000000000000000000000";

export async function GET() {
  try {
    const res = await fetch(RPC, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_call",
        params: [{ to: FTSOV2, data: DATA }, "latest"],
      }),
    });
    const json = await res.json();
    if (json.error) return NextResponse.json({ ok: false, error: json.error.message });
    const hex = (json.result as string).slice(2);
    const value = BigInt("0x" + hex.slice(0, 64));
    const decimals = Number(BigInt("0x" + hex.slice(64, 128)));
    const ts = Number(BigInt("0x" + hex.slice(128, 192)));
    return NextResponse.json({
      ok: true,
      price: Number(value) / 10 ** decimals,
      decimals,
      ts,
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message });
  }
}
