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
          enshrined protocols · non-custodial, FDC-verified, FTSO-priced.
        </p>
        <a
          href="/dashboard"
          className="display mt-12 inline-block rounded-lg bg-charcoal px-10 py-4 text-2xl text-butter shadow-xl transition-transform hover:scale-105"
        >
          Open console
        </a>
      </div>
    </section>
  );
}
