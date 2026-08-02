"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wordmark",
        { opacity: 0.08 },
        {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 90%",
            end: "top 30%",
            scrub: true,
          },
        }
      );
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={scope}
      className="relative overflow-hidden border-t border-paper/10"
    >
      <div className="px-6 pb-10 pt-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-mono text-sm text-paper">
                <span className="text-accent">_</span>standing-orders
              </p>
              <p className="mt-2 font-mono text-xs text-paper/40">
                Built for Flare Summer Signal 2026 — Bounty 1,
                Interoperable Asset Products
              </p>
            </div>
            <div className="flex items-center gap-8 font-mono text-xs uppercase tracking-[0.18em] text-paper/50">
              <a
                href="https://github.com/subheeksh5599/standing-orders"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link transition-colors hover:text-paper"
              >
                GitHub
              </a>
              <a
                href="https://dev.flare.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link transition-colors hover:text-paper"
              >
                Flare Dev Hub
              </a>
              <span className="text-paper/30">© 2026</span>
            </div>
          </div>
        </div>
      </div>
      <div className="wordmark select-none px-2 text-center font-display text-[9.5vw] font-bold uppercase leading-[0.8] tracking-[-0.04em] text-outline">
        Standing
        <br />
        Orders<span className="text-accent">_</span>
      </div>
    </footer>
  );
}
