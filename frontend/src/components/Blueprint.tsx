"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    fig: "FIG 01",
    title: "The signature",
    body: "One XRPL transaction. Memo-encoded instructions turn your wallet into a standing order. Flare Smart Accounts handle gas and execution — no new wallet, no gas token, no bridge. Your XRP stays in your account.",
    dim: "AUTH · XRPL SIG 1/1",
  },
  {
    fig: "FIG 02",
    title: "The mint",
    body: "Incoming XRP is proven on-chain by the Flare Data Connector, then minted into FXRP through FAssets v1.3 destination-tag routing. The payment you already know how to make becomes a yield position automatically.",
    dim: "PROOF · FDC REF-PAYMENT",
  },
  {
    fig: "FIG 03",
    title: "The agent",
    body: "A strategy agent watches realized yield across venues — Firelight, Kinetic, Clearstar — priced by FTSO v2. When a better venue appears, it re-routes your capital. Above a confidence threshold it acts; below it, it asks for one signature.",
    dim: "DECISION · CONFIDENCE ≥ 70%",
  },
  {
    fig: "FIG 04",
    title: "The receipt",
    body: "Every execution leaves a verifiable receipt on-chain. Amount, price, route, decision. Anyone can prove what happened, when, and why. Nothing to trust, everything to verify.",
    dim: "LEDGER · FLARE C-CHAIN",
  },
];

export default function Blueprint() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".bp-row");
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        stagger: 0.4,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: pinRef.current,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
      gsap.utils.toArray<HTMLElement>(".bp-ghost").forEach((g, i) => {
        gsap.fromTo(
          g,
          { x: 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top+=${i * 60}%`,
              end: `top+=${i * 60 + 25}%`,
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <section id="blueprint" ref={sectionRef} className="relative h-[420vh]">
      <div
        ref={pinRef}
        className="blueprint-grid sticky top-0 flex h-screen items-center overflow-hidden"
      >
        {/* corner crosshairs */}
        <div className="pointer-events-none absolute left-6 top-24">
          <div className="crosshair" />
          <p className="dim-label mt-3">X:0001 / Y:0001</p>
        </div>
        <div className="pointer-events-none absolute right-6 top-24">
          <div className="crosshair ml-auto" />
          <p className="dim-label mt-3 text-right">SCALE 1:1</p>
        </div>

        <div className="mx-auto w-full max-w-6xl px-6">
          <p className="fig-label">The mechanism</p>
          <h2 className="mt-8 max-w-3xl font-display text-4xl font-bold leading-[0.95] tracking-[-0.035em] text-paper sm:text-6xl">
            Four figures.
            <br />
            <span className="text-outline">One standing order.</span>
          </h2>

          <div className="mt-16">
            {STEPS.map((s, i) => (
              <div
                key={s.fig}
                className="bp-row grid grid-cols-[2.5rem_1fr] items-start gap-x-6 border-t border-paper/10 py-9 sm:grid-cols-[2.5rem_16rem_1fr_12rem]"
              >
                <span className="crosshair mt-2" />
                <div>
                  <p className="fig-label">{s.fig}</p>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-[-0.02em] text-paper sm:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-xl font-mono text-sm leading-relaxed text-paper/50">
                    {s.body}
                  </p>
                  <p className="dim-label mt-4">{s.dim}</p>
                </div>
                <span className="pointer-events-none absolute right-6 hidden select-none font-display text-[9rem] font-bold leading-none text-outline-faint sm:block">
                  0{i + 1}
                </span>
              </div>
            ))}
            <div className="border-t border-paper/10 py-8">
              <p className="font-mono text-sm text-paper/50">
                One signature at setup. One when the agent asks.{" "}
                <span className="text-paper">Nothing else, ever.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
