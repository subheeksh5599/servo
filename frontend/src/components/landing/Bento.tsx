import { Signature, Coins, Bot, ReceiptText, ShieldCheck, LineChart } from "lucide-react";
import LivePrice from "./LivePrice";

export default function Bento() {
  return (
    <section id="features" className="bg-paper px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-body text-xs uppercase tracking-widest text-charcoal/50">
          Features
        </p>
        <h2 className="display mt-4 text-6xl text-charcoal md:text-7xl">
          The machine,<br />in six parts.
        </h2>

        <div className="mt-16 grid auto-rows-[400px] grid-cols-1 gap-4 md:grid-cols-3">
          {/* 1 · spans 2 */}
          <div className="micro group relative col-span-1 overflow-hidden rounded-xl border border-charcoal/10 bg-[#f8f9fa] p-8 md:col-span-2">
            <div className="flex h-full flex-col justify-between">
              <div>
                <Signature className="h-8 w-8 text-charcoal" />
                <h3 className="display mt-6 text-3xl text-charcoal">One signature</h3>
                <p className="mt-3 max-w-md font-body text-charcoal/60">
                  A normal XRP payment with a Servo memo is your standing
                  order. The instruction rides inline · cadence, amount,
                  venue, strategy · and the Flare Data Connector proves it
                  on-chain before anything moves.
                </p>
              </div>
              {/* abstract pulse rows */}
              <div className="mt-8 space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span
                      className="h-2 w-2 rounded-full bg-butter"
                      style={{ animation: `pulse 1.6s ${i * 0.3}s infinite` }}
                    />
                    <span className="h-2.5 w-40 rounded-full bg-charcoal/10" />
                    <span className="h-2.5 w-24 rounded-full bg-charcoal/5" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2 */}
          <div className="micro group relative overflow-hidden rounded-xl bg-charcoal p-8 text-paper">
            <div className="flex h-full flex-col justify-between">
              <div>
                <Coins className="h-8 w-8 text-butter" />
                <h3 className="display mt-6 text-3xl text-paper">FXRP mint</h3>
                <p className="mt-3 font-body text-sage">
                  Incoming XRP becomes FXRP through FAssets v1.3 direct
                  minting · a payment you already know how to make becomes a
                  yield position.
                </p>
              </div>
              {/* code snippet */}
              <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-sage">
{`AssetManager
  .executeDirectMinting(
    proof,      // FDC-verified
  ) -> FXRP`}
              </pre>
            </div>
          </div>

          {/* 3 */}
          <div className="micro group relative overflow-hidden rounded-xl bg-[#f8f9fa] p-8">
            <div className="flex h-full flex-col justify-between">
              <div>
                <Bot className="h-8 w-8 text-charcoal" />
                <h3 className="display mt-6 text-3xl text-charcoal">Agent routing</h3>
                <p className="mt-3 font-body text-charcoal/60">
                  A strategy agent scores venues by realized APY from real
                  on-chain rates. Confident enough? It acts. Not sure? It
                  asks for one signature.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {["≥70% auto", "below · one signature", "receipt every run"].map((v) => (
                  <span
                    key={v}
                    className="rounded-full border border-charcoal/15 px-3 py-1.5 font-mono text-[10px] tracking-wider text-charcoal/60"
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 4 */}
          <div className="micro group relative overflow-hidden rounded-xl bg-[#f8f9fa] p-8">
            <div className="flex h-full flex-col justify-between">
              <div>
                <ShieldCheck className="h-8 w-8 text-charcoal" />
                <h3 className="display mt-6 text-3xl text-charcoal">FDC truth</h3>
                <p className="mt-3 font-body text-charcoal/60">
                  Every XRPL payment is verified against the Flare Data
                  Connector on-chain. No bridge, no trusted relayer · the
                  payment IS the instruction.
                </p>
              </div>
              <div className="rounded-lg border border-charcoal/10 bg-paper p-3 font-mono text-[11px] text-charcoal/50">
                verifyXRPPayment(proof) → true
              </div>
            </div>
          </div>

          {/* 5 */}
          <div className="micro group relative overflow-hidden rounded-xl bg-[#f8f9fa] p-8">
            <div className="flex h-full flex-col justify-between">
              <div>
                <LineChart className="h-8 w-8 text-charcoal" />
                <h3 className="display mt-6 text-3xl text-charcoal">FTSO pricing</h3>
                <p className="mt-3 font-body text-charcoal/60">
                  Every execution is priced by Flare's enshrined oracle ·
                  stale feeds block execution. No external price sources.
                </p>
              </div>
              <div className="flex items-end gap-3">
                <LivePrice className="display text-3xl text-charcoal" />
                <span className="pb-1 font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
                  XRP/USD · FTSO v2 · live
                </span>
              </div>
            </div>
          </div>

          {/* 6 */}
          <div className="micro group relative overflow-hidden rounded-xl bg-charcoal p-8 text-paper">
            <div className="flex h-full flex-col justify-between">
              <div>
                <ReceiptText className="h-8 w-8 text-butter" />
                <h3 className="display mt-6 text-3xl text-paper">Receipts</h3>
                <p className="mt-3 font-body text-sage">
                  Amount, price, route, timestamp · every execution is a
                  verifiable on-chain event. Prove any of it, any time.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-2 font-mono text-[11px] text-charcoal/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-butter" />
                  orderId · amountDrops · priceXrpUsd
                </span>
                <span className="flex items-center gap-2 font-mono text-[11px] text-charcoal/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-charcoal/20" />
                  venueId · venueAdapter · transactionId
                </span>
                <span className="flex items-center gap-2 font-mono text-[11px] text-charcoal/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                  timestamp · block · txHash
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
