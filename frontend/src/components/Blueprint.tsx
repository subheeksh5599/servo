"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    fig: "FIG 1",
    title: "The signature",
    body: "One XRPL transaction. Memo-encoded instructions turn your wallet into a standing order. Flare Smart Accounts handle gas and execution — no new wallet, no gas token, no bridge. Your XRP stays in your account.",
  },
  {
    fig: "FIG 2",
    title: "The mint",
    body: "Incoming XRP is proven on-chain by the Flare Data Connector, then minted into FXRP through FAssets v1.3 destination-tag routing. The payment you already know how to make becomes a yield position automatically.",
  },
  {
    fig: "FIG 3",
    title: "The agent",
    body: "A strategy agent watches realized yield across venues — Firelight, Kinetic, Clearstar — priced by FTSO v2. When a better venue appears, it re-routes your capital. Above a confidence threshold it acts; below it, it asks for one signature.",
  },
  {
    fig: "FIG 4",
    title: "The receipt",
    body: "Every execution leaves a verifiable receipt on-chain. Amount, price, route, decision. Anyone can prove what happened, when, and why. Nothing to trust, everything to verify.",
  },
];

export default function Blueprint() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>(".bp-row");
      gsap.set(rows, { opacity: 0.12, y: 32 });
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        stagger: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=280%",
          pin: pinRef.current,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <section id="blueprint" ref={sectionRef} className="relative h-[380vh]">
      <div
        ref={pinRef}
        className="sticky top-0 flex h-screen items-center overflow-hidden"
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <p className="fig-label">The mechanism</p>
          <h2 className="mt-8 font-display text-4xl font-bold tracking-[-0.03em] text-paper sm:text-5xl">
            Four figures. One standing order.
          </h2>
          <div className="mt-16 flex flex-col">
            {STEPS.map((s) => (
              <div
                key={s.fig}
                className="bp-row grid grid-cols-[4.5rem_1fr] gap-x-6 border-t border-paper/10 py-8 sm:grid-cols-[4.5rem_14rem_1fr]"
              >
                <span className="fig-label">{s.fig}</span>
                <h3 className="font-display text-2xl font-bold tracking-[-0.02em] text-paper sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-xl font-mono text-sm leading-relaxed text-paper/50 sm:col-start-3 sm:mt-0">
                  {s.body}
                </p>
              </div>
            ))}
            <div className="border-t border-paper/10 py-8">
              <p className="font-mono text-sm text-paper/50">
                One signature at setup. One signature when the agent asks.
                Nothing else, ever.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
