"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import MosaicCanvas from "./MosaicCanvas";

const BUILT_ON = ["Flare", "FDC", "FTSO v2", "FAssets", "XRPL", "Coston2"];

export default function Hero() {
  return (
    <section className="relative overflow-x-hidden">
      {/* mosaic art */}
      <div className="relative h-[340px] w-full overflow-hidden border-b hairline md:h-[420px]">
        <MosaicCanvas />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(237,240,238,0.9)_100%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 md:pt-20">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="display mx-auto max-w-4xl text-center text-[clamp(2.9rem,6.5vw,5.2rem)] text-[#0c2128]"
        >
          Sign once. Your XRP works forever.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-7 max-w-2xl text-center text-[17px] leading-relaxed text-[rgba(12,33,40,0.72)] md:text-[19px]"
        >
          Recurring money for XRP on Flare. One XRPL payment sets up dollar-cost
          averaging, subscriptions, or auto-sweep. A strategy agent routes your
          capital to the best yield venue, and only ever asks permission.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/dashboard"
            className="btn-pill btn-pill-solid w-full px-7 py-3 text-center text-[16px] sm:w-auto"
          >
            Open dashboard
          </Link>
          <a
            href="#verify"
            className="btn-pill btn-pill-ghost w-full px-7 py-3 text-center text-[16px] sm:w-auto"
          >
            Verify it yourself
          </a>
        </motion.div>
      </div>

      {/* built on marquee */}
      <div className="overflow-hidden border-y hairline py-4">
        <div className="marquee-track flex w-max items-center gap-10">
          {[...Array(3)].map((_, r) =>
            BUILT_ON.map((name) => (
              <span
                key={`${r}-${name}`}
                className="sec-label flex items-center gap-10 whitespace-nowrap"
              >
                {name}
                <span className="text-[rgba(12,33,40,0.3)]">·</span>
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
