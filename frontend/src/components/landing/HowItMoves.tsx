"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    n: "Pay",
    body:
      "An XRPL payment with a Servo memo lands on the receiving address. The watcher sees it, and the Flare Data Connector attests it in roughly a 90 second round.",
    chip: "verifyXRPPayment(proof)",
  },
  {
    n: "Register",
    body:
      "The attestation proof registers a standing order. Unverified proofs revert, so an order can only exist if the payment really happened.",
    chip: "registerOrder(proof, ownerEvm)",
  },
  {
    n: "Execute",
    body:
      "On schedule, the controller reads the FTSO v2 price, checks per-tick caps and the circuit breaker, and executes the tick.",
    chip: "execute(orderId)",
  },
  {
    n: "Route",
    body:
      "FXRP deposits into the chosen venue vault through an ERC4626 adapter, or stays as FXRP. One receipt per tick, with the price that was read.",
    chip: "ERC4626 deposit",
  },
];

export default function HowItMoves() {
  return (
    <section id="moves" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="sec-label">How a payment moves</p>
        <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.2rem)] text-[#0c2128]">
          One payment becomes an order, an order becomes ticks.
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-[rgba(12,33,40,0.72)]">
          No repeating transaction ever needs to be sent again. The schedule
          lives on-chain, enforced by the controller, and the agent only
          proposes the routing.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group rounded-2xl border hairline bg-[#edf0ee] p-7 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-baseline justify-between">
              <p className="font-display text-2xl text-[#0c2128]">{step.n}</p>
              <p className="sec-label">{String(i + 1).padStart(2, "0")}</p>
            </div>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[rgba(12,33,40,0.8)]">{step.body}</p>
            <code className="mt-5 block w-fit rounded-full border hairline bg-[rgba(12,33,40,0.05)] px-4 py-1.5 font-mono text-[12.5px] text-[#0c2128]">
              {step.chip}
            </code>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
