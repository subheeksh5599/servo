"use client";

import { motion } from "framer-motion";

const HIDDEN = [
  "Your XRPL address and its payment pattern as a standing schedule",
  "The strategy behind the orders, and the agent's confidence in it",
  "Which venue your capital sits in and when it moves",
  "Whether a tick was auto-executed or held for a signature",
];

const PUBLIC = [
  "That an order exists, keyed to an attested payment",
  "The FDC attestation proofs, verifiable against the Flare data connector",
  "FTSO v2 prices, read at execution time with a staleness window",
  "Execution receipts: amount, venue, price, and the epoch",
];

export default function WhatsHidden() {
  return (
    <section id="hidden" className="scroll-mt-20 border-y hairline bg-[rgba(12,33,40,0.03)]">
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="sec-label">What is hidden, and what is not</p>
          <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.2rem)] text-[#0c2128]">
            Being precise about this matters more than any feature list.
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border hairline bg-[#edf0ee] p-8"
          >
            <p className="font-display text-2xl text-[#0c2128]">Private</p>
            <p className="mt-1 text-[14px] italic text-[rgba(12,33,40,0.55)]">
              Not published as a schedule; kept by the order and the agent.
            </p>
            <ul className="mt-6 space-y-4">
              {HIDDEN.map((item) => (
                <li key={item} className="flex gap-3 text-[15.5px] leading-snug text-[rgba(12,33,40,0.85)]">
                  <span className="mt-0.5 font-mono text-[13px] text-[rgba(12,33,40,0.45)]">sealed</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border hairline bg-[#edf0ee] p-8"
          >
            <p className="font-display text-2xl text-[#0c2128]">Public</p>
            <p className="mt-1 text-[14px] italic text-[rgba(12,33,40,0.55)]">
              Visible to anyone reading Coston2.
            </p>
            <ul className="mt-6 space-y-4">
              {PUBLIC.map((item) => (
                <li key={item} className="flex gap-3 text-[15.5px] leading-snug text-[rgba(12,33,40,0.85)]">
                  <span className="mt-0.5 font-mono text-[13px] text-[rgba(12,33,40,0.45)]">open</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-12 max-w-3xl rounded-2xl border hairline p-7"
        >
          <p className="sec-label">Known limitation, stated plainly</p>
          <p className="mt-3 text-[16px] leading-relaxed text-[rgba(12,33,40,0.8)]">
            The XRPL payment that creates an order is itself a public
            transaction. Servo does not hide that payment. It removes the need
            to broadcast a repeating pattern: one payment, not a visible
            schedule. Execution receipts on Coston2 are public by design, and
            the FDC proofs anyone can re-verify are the point.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
