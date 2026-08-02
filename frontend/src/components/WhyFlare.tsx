const PROTOCOLS = [
  {
    label: "FSA",
    name: "Flare Smart Accounts",
    desc: "Your XRPL wallet is the control layer. One signature authorizes execution on Flare — gas abstracted, custody untouched.",
  },
  {
    label: "FAssets v1.3",
    name: "Direct minting",
    desc: "Destination-tag routing turns a normal XRP send into minted FXRP. No agent selection, no separate bridge step.",
  },
  {
    label: "FDC",
    name: "Flare Data Connector",
    desc: "Proves every XRPL payment on-chain before anything moves. The trust anchor for automation.",
  },
  {
    label: "FTSO v2",
    name: "Time Series Oracle",
    desc: "Enshrined price feeds price every mint and route decision — no external oracle, no single point of failure.",
  },
];

export default function WhyFlare() {
  return (
    <section id="flare" className="px-6 py-40">
      <div className="mx-auto w-full max-w-6xl">
        <p className="fig-label reveal">Why Flare</p>
        <h2 className="reveal mt-8 max-w-2xl font-display text-4xl font-bold tracking-[-0.03em] text-paper sm:text-5xl">
          Four enshrined protocols. One standing order.
        </h2>
        <p className="reveal mt-6 max-w-xl font-mono text-sm leading-relaxed text-paper/50">
          Standing Orders does not run on a bridge or a sidechain. It runs on
          the four data protocols Flare embeds in its consensus — the same
          rails FAssets uses to bring XRP into DeFi.
        </p>
        <div className="mt-16">
          {PROTOCOLS.map((p) => (
            <div
              key={p.label}
              className="reveal grid grid-cols-[5rem_1fr] gap-x-6 border-t border-paper/10 py-8 sm:grid-cols-[5rem_14rem_1fr]"
            >
              <span className="fig-label">{p.label}</span>
              <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-paper">
                {p.name}
              </h3>
              <p className="mt-2 max-w-xl font-mono text-sm leading-relaxed text-paper/50 sm:col-start-3 sm:mt-0">
                {p.desc}
              </p>
            </div>
          ))}
          <div className="border-t border-paper/10" />
        </div>
      </div>
    </section>
  );
}
