const STEPS = [
  {
    fig: "FIG 01",
    title: "The signature",
    body: "One XRPL transaction. Memo-encoded instructions turn your wallet into a standing order. Flare Smart Accounts handle gas and execution — no new wallet, no gas token, no bridge.",
    dim: "AUTH · XRPL SIG 1/1",
  },
  {
    fig: "FIG 02",
    title: "The mint",
    body: "Incoming XRP is proven on-chain by the Flare Data Connector, then minted into FXRP through FAssets v1.3 destination-tag routing. A payment you already know how to make becomes a yield position.",
    dim: "PROOF · FDC REF-PAYMENT",
  },
  {
    fig: "FIG 03",
    title: "The agent",
    body: "A strategy agent watches realized yield across venues — Firelight, Kinetic, Clearstar — priced by FTSO v2. When a better venue appears it re-routes. Above a confidence threshold it acts; below it, it asks for one signature.",
    dim: "DECISION · CONFIDENCE ≥ 70%",
  },
  {
    fig: "FIG 04",
    title: "The receipt",
    body: "Every execution leaves a verifiable receipt on-chain. Amount, price, route, decision. Anyone can prove what happened, when, and why.",
    dim: "LEDGER · FLARE C-CHAIN",
  },
];

export default function FigSections() {
  return (
    <section id="blueprint" className="mx-auto max-w-6xl px-6 py-20">
      <p className="sec-label">The mechanism</p>
      <h2
        className="mt-4 font-sans text-3xl font-bold uppercase tracking-[-0.02em] text-white sm:text-4xl"
        style={{ fontFamily: "var(--font-anek)" }}
      >
        Four figures. One standing order.
      </h2>

      <div className="mt-10">
        {STEPS.map((s) => (
          <div
            key={s.fig}
            className="grid grid-cols-[4.5rem_1fr] gap-x-5 border-t border-white/10 py-7 sm:grid-cols-[4.5rem_14rem_1fr]"
          >
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-white/30">
              {s.fig}
            </span>
            <h3
              className="font-sans text-xl font-semibold uppercase tracking-[-0.01em] text-white"
              style={{ fontFamily: "var(--font-anek)" }}
            >
              {s.title}
            </h3>
            <div className="mt-2 sm:col-start-3 sm:mt-0">
              <p className="max-w-xl font-mono text-sm leading-relaxed text-white/50">
                {s.body}
              </p>
              <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/25">
                {s.dim}
              </p>
            </div>
          </div>
        ))}
        <div className="border-t border-white/10 py-6">
          <p className="font-mono text-sm text-white/50">
            One signature at setup. One when the agent asks.{" "}
            <span className="text-[#09FD67]">Nothing else, ever.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
