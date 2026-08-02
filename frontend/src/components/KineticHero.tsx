"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import FtsoTicker from "./FtsoTicker";

export default function KineticHero() {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.09,
          delay: 0.2,
        }
      );
      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.9, stagger: 0.12 }
      );
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scope}
      id="top"
      className="blueprint-grid relative flex min-h-screen flex-col justify-end overflow-hidden"
    >
      {/* ghost numeral */}
      <div className="pointer-events-none absolute -right-8 top-16 select-none font-display text-[22vw] font-bold leading-none tracking-[-0.04em] text-outline-faint">
        01
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-40">
        <p className="hero-fade fig-label">Flare Summer Signal 2026 — Bounty 1</p>

        <h1 className="mt-12 font-display text-[clamp(3.25rem,12.5vw,12.5rem)] font-bold leading-[0.88] tracking-[-0.045em] text-paper">
          <span className="block">
            <span className="w-mask">
              <span className="hero-word">SIGN</span>
            </span>{" "}
            <span className="w-mask">
              <span className="hero-word">ONCE.</span>
            </span>
          </span>
          <span className="block">
            <span className="w-mask">
              <span className="hero-word text-outline">YOUR</span>
            </span>{" "}
            <span className="w-mask">
              <span className="hero-word">XRP</span>
            </span>
          </span>
          <span className="block">
            <span className="w-mask">
              <span className="hero-word">WORKS</span>
            </span>{" "}
            <span className="w-mask">
              <span className="hero-word text-accent">FOREVER</span>
            </span>
          </span>
        </h1>

        <p className="hero-fade mt-12 max-w-xl font-mono text-sm leading-relaxed text-paper/55">
          Recurring money for XRP, built on Flare. One XRPL signature sets up
          dollar-cost averaging, subscriptions, and auto-sweep. A strategy
          agent routes your capital to the best yield venue — and only ever
          asks permission.
        </p>

        <div className="hero-fade mt-14 flex flex-wrap items-center gap-8">
          <a
            href="#blueprint"
            className="group relative overflow-hidden bg-accent px-8 py-4 font-mono text-sm uppercase tracking-[0.18em] text-paper"
          >
            <span className="relative z-10">How it works</span>
            <span className="absolute inset-0 -translate-x-full bg-paper transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0" />
            <span className="absolute inset-0 z-10 flex items-center justify-center text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              How it works
            </span>
          </a>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper/40">
            FSA · FAssets v1.3 · FDC · FTSO v2
          </span>
        </div>
      </div>

      <FtsoTicker />
    </section>
  );
}
