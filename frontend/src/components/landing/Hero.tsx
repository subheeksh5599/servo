"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-grid-light pt-40 pb-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
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
          dollar-cost averaging, subscriptions, and auto-sweep · a strategy
          agent routes your capital to the best yield venue, and only ever
          asks permission.
        </motion.p>

        <motion.a
          href="/dashboard"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="display mt-12 inline-block rounded-lg bg-butter px-10 py-4 text-2xl text-charcoal shadow-[0_10px_30px_-12px_#171e1966] transition-transform hover:scale-105"
        >
          Open console
        </motion.a>

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
