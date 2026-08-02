const ITEMS = [
  {
    n: "05",
    label: "FBTC",
    title: "Standing orders for bitcoin",
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
    <section id="roadmap" className="mx-auto max-w-6xl px-6 py-20">
      <p className="sec-label">Roadmap</p>
      <h2
        className="mt-4 font-sans text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl"
        style={{ fontFamily: "var(--font-anek)" }}
      >
        After the signal
      </h2>

      <div className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
        {ITEMS.map((it) => (
          <div
            key={it.n}
            className="bg-[#0B0B0E] p-6 transition-colors hover:bg-[#121216]"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-white/40">
                {it.label}
              </span>
              <span className="font-mono text-sm text-white/25">{it.n}</span>
            </div>
            <h3
              className="mt-6 font-sans text-lg font-semibold uppercase leading-tight tracking-[-0.01em] text-white"
              style={{ fontFamily: "var(--font-anek)" }}
            >
              {it.title}
            </h3>
            <p className="mt-3 font-mono text-sm leading-relaxed text-white/50">
              {it.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
