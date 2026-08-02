const PROTOCOLS = [
  {
    n: "01",
    label: "FSA",
    name: "Flare Smart Accounts",
    desc: "Your XRPL wallet is the control layer. One signature authorizes execution on Flare — gas abstracted, custody untouched.",
    status: "LIVE",
  },
  {
    n: "02",
    label: "FASSETS v1.3",
    name: "Direct minting",
    desc: "Destination-tag routing turns a normal XRP send into minted FXRP. No agent selection, no separate bridge step.",
    status: "LIVE",
  },
  {
    n: "03",
    label: "FDC",
    name: "Flare Data Connector",
    desc: "Proves every XRPL payment on-chain before anything moves. The trust anchor for automation.",
    status: "LIVE",
  },
  {
    n: "04",
    label: "FTSO v2",
    name: "Time Series Oracle",
    desc: "Enshrined price feeds price every mint and route decision — no external oracle, no single point of failure.",
    status: "LIVE",
  },
];

export default function WhyFlare() {
  return (
    <section id="flare" className="mx-auto max-w-6xl px-6 py-20">
      <p className="sec-label">Why Flare</p>
      <h2
        className="mt-4 font-sans text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl"
        style={{ fontFamily: "var(--font-anek)" }}
      >
        Four enshrined protocols. One standing order.
      </h2>

      <div className="mt-10">
        {PROTOCOLS.map((p) => (
          <div
            key={p.n}
            className="grid grid-cols-[3rem_1fr] gap-x-5 border-t border-white/10 py-7 transition-colors hover:border-white/25 sm:grid-cols-[3rem_9rem_14rem_1fr_6rem] sm:items-baseline"
          >
            <span className="font-mono text-sm text-white/25">{p.n}</span>
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-white/40">
              {p.label}
            </span>
            <h3
              className="mt-1 font-sans text-lg font-semibold uppercase tracking-[-0.01em] text-white sm:mt-0"
              style={{ fontFamily: "var(--font-anek)" }}
            >
              {p.name}
            </h3>
            <p className="mt-2 max-w-xl font-mono text-sm leading-relaxed text-white/50 sm:mt-0">
              {p.desc}
            </p>
            <span className="chip chip-live mt-3 w-fit sm:mt-0 sm:ml-auto">
              {p.status}
            </span>
          </div>
        ))}
        <div className="border-t border-white/10" />
      </div>
    </section>
  );
}
