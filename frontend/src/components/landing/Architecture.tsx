"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const NODES = [
  { id: "fdc", label: "FDC", x: -340, y: -120, note: "proves your payment" },
  { id: "ftso", label: "FTSO v2", x: 340, y: -120, note: "prices every run" },
  { id: "fassets", label: "FAssets", x: -340, y: 120, note: "mints FXRP" },
  { id: "registry", label: "Registry", x: 0, y: -220, note: "stores the order" },
  { id: "controller", label: "Controller", x: 0, y: 220, note: "executes + receipts" },
  { id: "venues", label: "Venues", x: 340, y: 120, note: "stXRP · earnXRP" },
];

export default function Architecture() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.45"],
  });

  // center node: expands + rotates while exploding
  const centerScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.5]);
  const centerRot = useTransform(scrollYProgress, [0, 0.35], [0, 90]);

  // per-node travel: explode out, then lock (stable hook count — 6 nodes)
  const nodeX = NODES.map((_, i) =>
    useTransform(scrollYProgress, [0.15, 0.55, 0.85], [0, NODES[i].x, NODES[i].x])
  );
  const nodeY = NODES.map((_, i) =>
    useTransform(scrollYProgress, [0.15, 0.55, 0.85], [0, NODES[i].y, NODES[i].y])
  );
  const nodeOpacity = NODES.map((_, i) =>
    useTransform(scrollYProgress, [0.1, 0.3, 0.7], [0, 1, 1])
  );

  return (
    <section id="architecture" className="bg-charcoal px-6 py-28 text-paper">
      <div className="mx-auto max-w-6xl">
        <p className="font-body text-xs uppercase tracking-widest text-sage/60">
          Architecture
        </p>
        <h2 className="display mt-4 text-6xl text-paper md:text-7xl">
          One order.
          <br />
          <span className="text-butter">Six enshrined parts.</span>
        </h2>

        <div ref={ref} className="relative mt-16 h-[70vh]">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* center node */}
            <motion.div
              style={{ scale: centerScale, rotate: centerRot, zIndex: 10 }}
              className="display flex h-44 w-44 items-center justify-center rounded-full border-2 border-butter bg-charcoal text-center text-base text-butter shadow-[0_0_60px_-10px_#ffe17c66]"
            >
              STANDING
              <br />
              ORDER
            </motion.div>

            {/* exploding nodes */}
            {NODES.map((n, i) => (
              <motion.div
                key={n.id}
                style={{
                  x: nodeX[i],
                  y: nodeY[i],
                  opacity: nodeOpacity[i],
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                }}
                className="flex w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
              >
                <span className="display rounded-lg border border-sage/20 bg-coal px-4 py-2 text-sm text-paper">
                  {n.label}
                </span>
                <span className="mt-2 font-mono text-[10px] uppercase tracking-widest text-sage/50">
                  {n.note}
                </span>
              </motion.div>
            ))}
          </div>

          <p className="absolute bottom-0 left-0 right-0 text-center font-mono text-xs uppercase tracking-widest text-sage/40">
            scroll — the order explodes into the Flare stack, then locks
          </p>
        </div>
      </div>
    </section>
  );
}
