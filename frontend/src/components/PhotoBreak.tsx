"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PhotoBreak({
  src,
  caption,
  align = "left",
}: {
  src: string;
  caption: string;
  align?: "left" | "right";
}) {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".photo-img",
        { yPercent: 8, scale: 1.06 },
        {
          yPercent: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.1,
          },
        }
      );
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={scope} className="relative overflow-hidden">
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={src}
          alt={caption}
          className="photo-img absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40" />
        <div
          className={`absolute bottom-10 max-w-6xl px-6 ${align === "right" ? "right-0 text-right" : "left-0"}`}
        >
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-foreground/80">
            {caption}
          </p>
        </div>
      </div>
    </section>
  );
}
