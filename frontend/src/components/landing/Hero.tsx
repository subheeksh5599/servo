"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-grid-light pt-40 pb-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-1.5 font-body text-xs uppercase tracking-widest text-charcoal/60"
        >
          <span className="h-2 w-2 rounded-full bg-butter" />
          Flare Summer Signal 2026 · Bounty 1
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="display text-[clamp(3.5rem,9vw,9rem)] text-charcoal"
        >
          Sign once.
          <br />
          Your XRP
          <br />
          <span className="hl">works forever.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 max-w-xl font-body text-lg text-charcoal/70"
        >
          Servo is recurring money for XRP. One XRPL signature sets up
          dollar-cost averaging, subscriptions, and auto-sweep — a strategy
          agent routes your capital to the best yield venue, and only ever
          asks permission.
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          onSubmit={(e) => e.preventDefault()}
          className="mt-12 flex w-full max-w-lg flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            placeholder="you@xrp.dev"
            className="h-14 flex-1 rounded-lg border border-charcoal/20 bg-paper px-6 font-body text-charcoal outline-none transition-colors focus:border-charcoal"
          />
          <button
            type="submit"
            className="display h-14 rounded-lg bg-butter px-8 text-xl text-charcoal transition-transform hover:scale-105"
          >
            Join waitlist
          </button>
        </motion.form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 font-body text-xs uppercase tracking-widest text-charcoal/40"
        >
          Non-custodial · FDC-verified · FTSO-priced · on-chain receipts
        </motion.p>
      </div>
    </section>
  );
}
