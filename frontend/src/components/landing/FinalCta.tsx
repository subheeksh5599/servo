"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-28 text-center md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="display mx-auto max-w-3xl text-[clamp(2.4rem,5.5vw,4.2rem)] text-[#0c2128]">
          Sign once. Your XRP works forever.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-[rgba(12,33,40,0.72)]">
          One XRPL payment, a verifiable proof, and the schedule runs itself
          within caps, behind a circuit breaker, with an agent that only
          proposes.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/dashboard" className="btn-pill btn-pill-solid w-full px-8 py-3.5 text-[16px] sm:w-auto">
            Open dashboard
          </Link>
          <a
            href="https://github.com/subheeksh5599/servo"
            target="_blank"
            rel="noreferrer"
            className="btn-pill btn-pill-ghost w-full px-8 py-3.5 text-[16px] sm:w-auto"
          >
            Read the code
          </a>
        </div>
      </motion.div>
    </section>
  );
}
