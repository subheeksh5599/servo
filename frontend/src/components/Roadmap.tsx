const ITEMS = [
  {
    label: "FBTC",
    title: "Standing orders for Bitcoin",
    desc: "FAssets v2 brings FBTC, FDOGE, FLTC. The same automation, architected for the next assets from day one.",
  },
  {
    label: "REDEEM",
    title: "Auto-redeem back to XRPL",
    desc: "On schedule or on price target, FXRP redeems to native XRP in your wallet. The loop closes.",
  },
  {
    label: "FCC",
    title: "Private strategy execution",
    desc: "The agent's strategy logic moves inside Flare Confidential Compute — sealed keys, signed execution proofs.",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="px-6 py-40">
      <div className="mx-auto w-full max-w-6xl">
        <p className="fig-label reveal">Roadmap</p>
        <h2 className="reveal mt-8 max-w-2xl font-display text-4xl font-bold tracking-[-0.03em] text-paper sm:text-5xl">
          After the signal
        </h2>
        <div className="mt-16 grid gap-px overflow-hidden border border-paper/10 sm:grid-cols-3">
          {ITEMS.map((it) => (
            <div key={it.label} className="reveal bg-ink p-8">
              <span className="fig-label">{it.label}</span>
              <h3 className="mt-6 font-display text-xl font-bold tracking-[-0.02em] text-paper">
                {it.title}
              </h3>
              <p className="mt-4 font-mono text-sm leading-relaxed text-paper/50">
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
