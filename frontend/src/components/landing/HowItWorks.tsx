"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "01",
    title: "Pay once",
    desc: "Send XRP to the Servo address with a memo · cadence, amount, venue, strategy packed into the payment itself. The Flare Data Connector certifies it on-chain.",
  },
  {
    n: "02",
    title: "The machine mints",
    desc: "Incoming XRP becomes FXRP through FAssets v1.3 direct minting. No agent selection, no bridge step · a payment you already know how to make.",
  },
  {
    n: "03",
    title: "It routes, forever",
    desc: "The strategy agent reads realized yield from real on-chain rates, re-routes above 70% confidence, and asks for one signature below it. Receipts for everything.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-paper px-6 py-28">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-3">
        <div className="md:sticky md:top-28 md:self-start">
          <p className="font-body text-xs uppercase tracking-widest text-charcoal/50">
            How it works
          </p>
          <h2 className="display mt-4 text-7xl text-charcoal">
            Three<br />moves.<br />Zero<br />after.
          </h2>
        </div>

        <div className="space-y-10 md:col-span-2">
          {STEPS.map((s) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0.4 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="group flex items-start gap-8 border-t border-charcoal/10 pt-10 transition-opacity duration-300"
            >
              <span className="display text-8xl text-butter/30 transition-colors duration-300 group-hover:text-butter">
                {s.n}
              </span>
              <div className="pt-4">
                <h3 className="display text-3xl text-charcoal">{s.title}</h3>
                <p className="mt-3 max-w-md font-body text-lg leading-relaxed text-charcoal/60">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
