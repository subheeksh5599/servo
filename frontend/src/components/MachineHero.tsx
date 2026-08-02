"use client";

import useXrpPrice from "./useXrpPrice";
import type { ReactNode } from "react";

function Node({
  title,
  sub,
  children,
}: {
  title: string;
  sub: string;
  children?: ReactNode;
}) {
  return (
    <div className="node">
      <div className="flex items-center justify-between gap-3">
        <span className="node-title">{title}</span>
        {children}
      </div>
      <p className="node-sub">{sub}</p>
    </div>
  );
}

function Edge() {
  return (
    <div className="edge">
      <span className="edge-line" />
      <span className="edge-arrow">→</span>
      <span className="edge-line" />
    </div>
  );
}

export default function MachineHero() {
  const { price, live } = useXrpPrice();

  const nodes = [
    { t: "XRPL WALLET", s: "your xrp stays here" },
    { t: "ONE SIGNATURE", s: "fsa · memo intent" },
    { t: "FDC ATTEST", s: "payment proven onchain" },
    { t: "FXRP MINT", s: "fassets v1.3 · tag route" },
    { t: "AGENT ROUTE", s: "best realized yield" },
    { t: "ON-CHAIN RECEIPT", s: "amount · price · route" },
  ];

  return (
    <section id="top" className="mx-auto max-w-6xl px-6 pb-10 pt-16">
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.22em] text-white/40">
        Flare Summer Signal 2026 · Bounty 1 — Interoperable Asset Products
      </p>

      <h1
        className="mt-6 font-sans text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] text-white"
        style={{ fontFamily: "var(--font-anek)" }}
      >
        Sign once.
        <br />
        Your XRP works <span className="text-[#09FD67]">forever.</span>
      </h1>

      <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-white/50">
        Recurring money for XRP, built on Flare. One XRPL signature sets up
        dollar-cost averaging, subscriptions, and auto-sweep. A strategy agent
        routes your capital to the best yield venue — and only ever asks
        permission.
      </p>

      {/* live machine */}
      <div className="mt-14">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/30">
            pipeline — live view
          </span>
          <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/30">
            <span className="live-dot" />
            {live ? "running" : "feed offline"}
          </span>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch">
          {nodes.map((n, i) => (
            <div key={n.t} className="flex flex-1 flex-col gap-2 lg:flex-row lg:items-stretch">
              <div className="flex-1">
                <Node title={n.t} sub={n.s}>
                  {i === 0 ? (
                    <span className="chip chip-live">LIVE</span>
                  ) : i === 5 ? (
                    <span className="chip chip-dim">LEDGER</span>
                  ) : (
                    <span className="chip chip-dim">STEP</span>
                  )}
                </Node>
              </div>
              {i < nodes.length - 1 && <Edge />}
            </div>
          ))}
        </div>
        {/* price bar */}
        <div className="mt-2 flex items-center gap-4 border border-white/10 bg-[#121216] px-4 py-2 font-mono text-[0.6875rem]">
          <span className="text-white/35">FTSO V2 · XRP/USD</span>
          <span className="text-[#09FD67]">
            {price !== null ? price.toFixed(6) : "—"}
          </span>
          <span className="text-white/25">prices every execution</span>
          <span className="ml-auto hidden text-white/25 sm:inline">
            {live ? "live from flare" : "feed offline"}
          </span>
        </div>
      </div>
    </section>
  );
}
