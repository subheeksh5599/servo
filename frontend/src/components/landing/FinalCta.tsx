"use client";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-butter px-6 py-32 text-charcoal">
      {/* decorative giant text overlays */}
      <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
        <span className="display absolute -top-4 left-4 text-[16vw] leading-none text-charcoal/10">SIGN</span>
        <span className="display absolute bottom-0 right-4 text-[16vw] leading-none text-charcoal/10">ONCE</span>
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <h2 className="display text-6xl leading-[0.9] text-charcoal md:text-8xl">
          Your XRP should work while you sleep.
        </h2>
        <p className="mt-8 max-w-2xl font-body text-2xl leading-relaxed text-charcoal/70">
          One signature. One machine. Receipts forever. Built on Flare's
          enshrined protocols — non-custodial, FDC-verified, FTSO-priced.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-12 flex w-full max-w-xl flex-col gap-4 sm:flex-row"
        >
          <input
            type="email"
            placeholder="you@xrp.dev"
            className="h-14 flex-1 rounded-lg border-2 border-charcoal bg-paper px-6 font-body text-charcoal outline-none focus:border-charcoal"
          />
          <button
            type="submit"
            className="display h-14 rounded-lg bg-charcoal px-8 text-xl text-butter shadow-xl transition-transform hover:scale-105"
          >
            Join waitlist
          </button>
        </form>
        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-charcoal/50">
          Flare Summer Signal 2026 · Bounty 1
        </p>
      </div>
    </section>
  );
}
