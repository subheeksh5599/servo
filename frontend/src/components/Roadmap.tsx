const ITEMS = [
  {
    n: "05",
    label: "FBTC",
    title: "Standing orders for Bitcoin",
    desc: "FAssets v2 brings FBTC, FDOGE, FLTC. The same automation, architected for the next assets from day one.",
  },
  {
    n: "06",
    label: "REDEEM",
    title: "Auto-redeem back to XRPL",
    desc: "On schedule or on price target, FXRP redeems to native XRP in your wallet. The loop closes.",
  },
  {
    n: "07",
    label: "FCC",
    title: "Private strategy execution",
    desc: "The agent's strategy logic moves inside Flare Confidential Compute — sealed keys, signed execution proofs.",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative overflow-hidden px-6 py-44">
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-display text-[16vw] font-bold uppercase tracking-[-0.04em] text-outline-faint">
        Next
      </div>
      <div className="relative mx-auto w-full max-w-6xl">
        <p className="fig-label reveal">Roadmap</p>
        <h2 className="reveal mt-8 font-display text-4xl font-bold leading-[0.95] tracking-[-0.035em] text-paper sm:text-6xl">
          After the signal
        </h2>
        <div className="mt-20 grid gap-px border border-paper/10 bg-paper/10 sm:grid-cols-3">
          {ITEMS.map((it) => (
            <div
              key={it.n}
              className="group bg-ink p-9 transition-colors duration-500 hover:bg-surface"
            >
              <div className="flex items-baseline justify-between">
                <span className="fig-label">{it.label}</span>
                <span className="font-mono text-sm text-paper/25">
                  {it.n}
                </span>
              </div>
              <h3 className="mt-8 font-display text-2xl font-bold leading-[1.02] tracking-[-0.02em] text-paper">
                {it.title}
              </h3>
              <p className="mt-5 font-mono text-sm leading-relaxed text-paper/50">
                {it.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
