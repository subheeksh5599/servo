"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import useXrpPrice from "@/hooks/useXrpPrice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  const scope = useRef<HTMLElement>(null);
  const { price, live } = useXrpPrice();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-word",
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08,
          delay: 0.3,
        }
      );
      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.9, stagger: 0.1 }
      );
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={scope}
      id="top"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden"
    >
      {/* cinematic video background */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/coin.png"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_78%)]"
      />
      <div aria-hidden className="absolute inset-0 bg-background/30" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-36">
        <div className="hero-fade mb-8 flex items-center gap-3">
          <Badge variant="secondary" className="font-mono text-xs">
            Flare Summer Signal 2026
          </Badge>
          <Badge variant="live" className="font-mono text-xs">
            <span className={`live-dot ${live ? "" : "opacity-40"}`} />
            {live
              ? `XRP/USD $${price !== null ? price.toFixed(4) : "—"}`
              : "feed offline"}
          </Badge>
        </div>

        <h1 className="max-w-4xl font-display text-[clamp(3rem,9vw,8.5rem)] font-bold leading-[0.92] tracking-[-0.04em]">
          <span className="block">
            <span className="w-mask"><span className="hero-word">Sign</span></span>{" "}
            <span className="w-mask"><span className="hero-word">once.</span></span>
          </span>
          <span className="block">
            <span className="w-mask"><span className="hero-word text-primary">Your XRP</span></span>{" "}
            <span className="w-mask"><span className="hero-word">works</span></span>
          </span>
          <span className="block">
            <span className="w-mask"><span className="hero-word">forever.</span></span>
          </span>
        </h1>

        <p className="hero-fade mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Servo is recurring money for XRP, built on Flare. One XRPL signature
          sets up dollar-cost averaging, subscriptions, and auto-sweep. A
          strategy agent routes your capital to the best yield venue — and only
          ever asks permission.
        </p>

        <div className="hero-fade mt-12 flex flex-wrap items-center gap-4">
          <a href="#mechanism">
            <Button size="lg">See it run</Button>
          </a>
          <a
            href="https://github.com/subheeksh5599/servo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" variant="outline">
              View source
            </Button>
          </a>
        </div>

        <p className="hero-fade mt-14 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
          FSA · FAssets v1.3 · FDC · FTSO v2 — non-custodial
        </p>
      </div>
    </section>
  );
}
