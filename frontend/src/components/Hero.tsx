export default function Hero() {
  return (
    <section
      id="top"
      className="flex min-h-screen flex-col justify-end px-6 pb-24 pt-40"
    >
      <div className="mx-auto w-full max-w-6xl">
        <p className="fig-label reveal">Flare Summer Signal 2026 — Bounty 1</p>
        <h1 className="reveal mt-10 max-w-4xl font-display text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.94] tracking-[-0.04em] text-paper">
          Sign once.
          <br />
          Your XRP works{" "}
          <span className="text-accent">forever</span>
        </h1>
        <p className="reveal mt-10 max-w-xl font-mono text-base leading-relaxed text-paper/60">
          Recurring money for XRP, built on Flare. One XRPL signature sets up
          dollar-cost averaging, subscriptions, and auto-sweep. A strategy
          agent routes your capital to the best yield venue — and only ever
          asks permission.
        </p>
        <div className="reveal mt-12 flex flex-wrap items-center gap-6">
          <a
            href="#blueprint"
            className="rounded-sm bg-accent px-8 py-4 font-mono text-sm uppercase tracking-[0.18em] text-paper transition-opacity hover:opacity-85"
          >
            How it works
          </a>
          <span className="font-mono text-xs text-paper/40">
            Non-custodial · One signature · Built on FSA + FAssets v1.3 + FDC + FTSO v2
          </span>
        </div>
      </div>
    </section>
  );
}
