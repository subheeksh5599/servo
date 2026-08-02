// Send a standing-order XRPL payment (demo / E2E).
// Builds the Servo memo, funds the tx, and pays XRPL_RECEIVING_ADDRESS.
//
// Usage:
//   XRPL_SENDER_SEED=<testnet secret> \
//   XRPL_RECEIVING_ADDRESS=<watcher address> \
//   XRPL_DESTINATION_TAG=<tag> \
//   MEMO_CADENCE=3600 MEMO_AMOUNT_XRP=25 MEMO_VENUE=1 MEMO_STRATEGY=1 \
//   node send-standing-order.mjs

import "dotenv/config";
import { Client, Wallet, xrpToDrops } from "xrpl";

const env = process.env;

/** Servo memo: "SR" | version | flags | cadence(u32) | amount(u64 drops) | venue | strategy | reserved */
export function buildServoMemo({ cadenceSeconds, amountDrops, venueId, strategyId = 1, autoExecute = true }) {
  const b = Buffer.alloc(20);
  b.writeUInt8(0x53, 0); // S
  b.writeUInt8(0x52, 1); // R
  b.writeUInt8(0x01, 2); // version
  b.writeUInt8(autoExecute ? 0x01 : 0x00, 3); // flags
  b.writeUInt32BE(cadenceSeconds, 4);
  b.writeBigUInt64BE(BigInt(amountDrops), 8);
  b.writeUInt8(venueId, 16);
  b.writeUInt8(strategyId, 17);
  return b.toString("hex").toUpperCase();
}

async function main() {
  const seed = env.XRPL_SENDER_SEED;
  const to = env.XRPL_RECEIVING_ADDRESS;
  if (!seed || !to) {
    console.error("need XRPL_SENDER_SEED and XRPL_RECEIVING_ADDRESS");
    process.exit(1);
  }
  const wallet = Wallet.fromSeed(seed);
  const client = new Client(env.XRPL_WSS);
  await client.connect();

  const cadence = Number(env.MEMO_CADENCE || 3600);
  const amountXrp = Number(env.MEMO_AMOUNT_XRP || 25);
  const venue = Number(env.MEMO_VENUE || 1);
  const strategy = Number(env.MEMO_STRATEGY || 1);
  const tag = env.XRPL_DESTINATION_TAG ? Number(env.XRPL_DESTINATION_TAG) : undefined;
  const amountDrops = Number(xrpToDrops(amountXrp));
  const memoHex = buildServoMemo({ cadenceSeconds: cadence, amountDrops, venueId: venue, strategyId: strategy });

  console.log(`sending ${amountXrp} XRP to ${to}${tag ? ` tag=${tag}` : ""}`);
  console.log(`memo: ${memoHex} (cadence=${cadence}s venue=${venue} strategy=${strategy})`);

  const tx = {
    TransactionType: "Payment",
    Account: wallet.classicAddress,
    Destination: to,
    Amount: xrpToDrops(amountXrp),
    Memos: [{ Memo: { MemoType: Buffer.from("servo", "utf8").toString("hex").toUpperCase(), MemoData: memoHex } }],
    ...(tag !== undefined ? { DestinationTag: tag } : {}),
  };
  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  console.log(`tx result: ${result.result.meta?.TransactionResult} hash=${result.result.hash}`);
  await client.disconnect();
}

main().catch((e) => { console.error("[send]", e.message); process.exit(1); });
