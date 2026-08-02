const PROTOCOLS = [
  {
    n: "01",
    label: "FSA",
    name: "Flare Smart Accounts",
    desc: "Your XRPL wallet is the control layer. One signature authorizes execution on Flare — gas abstracted, custody untouched.",
    ann: "AUTH LAYER",
  },
  {
    n: "02",
    label: "FASSETS v1.3",
    name: "Direct minting",
    desc: "Destination-tag routing turns a normal XRP send into minted FXRP. No agent selection, no separate bridge step.",
    ann: "MINT RAIL",
  },
  {
    n: "03",
    label: "FDC",
    name: "Flare Data Connector",
    desc: "Proves every XRPL payment on-chain before anything moves. The trust anchor for automation.",
    ann: "TRUTH ANCHOR",
  },
  {
    n: "04",
    label: "FTSO v2",
    name: "Time Series Oracle",
    desc: "Enshrined price feeds price every mint and route decision — no external oracle, no single point of failure.",
    ann: "PRICE SOURCE",
  },
];

export default function WhyFlare() {
  return (
    <section id="flare" className="px-6 py-44">
      <div className="mx-auto w-full max-w-6xl">
        <p className="fig-label reveal">Why Flare</p>
        <h2 className="reveal mt-8 font-display text-4xl font-bold leading-[0.95] tracking-[-0.035em] text-paper sm:text-6xl">
          Four enshrined protocols.
          <br />
          <span className="text-outline">One standing order.</span>
        </h2>

        <div className="mt-20">
          {PROTOCOLS.map((p) => (
            <div
              key={p.n}
              className="reveal group grid grid-cols-[3rem_1fr] gap-x-6 border-t border-paper/10 py-10 transition-colors duration-500 hover:border-paper/30 sm:grid-cols-[3rem_8rem_16rem_1fr_10rem] sm:items-baseline"
            >
              <span className="font-mono text-sm text-paper/30">{p.n}</span>
              <span className="fig-label">{p.label}</span>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-paper transition-colors duration-300 group-hover:text-accent sm:mt-0">
                {p.name}
              </h3>
              <p className="mt-3 max-w-xl font-mono text-sm leading-relaxed text-paper/50 sm:mt-0">
                {p.desc}
              </p>
              <span className="dim-label mt-4 sm:mt-0 sm:text-right">
                {p.ann}
              </span>
            </div>
          ))}
          <div className="border-t border-paper/10" />
        </div>
      </div>
    </section>
  );
}
