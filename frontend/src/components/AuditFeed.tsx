"use client";

import { useEffect, useState } from "react";
import useXrpPrice from "./useXrpPrice";

export default function AuditFeed() {
  const { price, live } = useXrpPrice();
  const [logs, setLogs] = useState<string[]>([
    "[boot] standing-orders console v0.1 — coston2 + mainnet read",
    "[ftsov2] flare contract registry → ftso-v2 resolved",
    "[ftsov2] feed xrp/usd subscribed (20s poll)",
    "[fdc] verifier api ready — reference-payment attestations",
    "[status] contracts: registry-only reads · no mock data",
  ]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = window.setInterval(() => {
      setTick((t) => t + 1);
    }, 20000);
    return () => window.clearInterval(iv);
  }, []);

  useEffect(() => {
    if (price !== null && live && tick > 0) {
      setLogs((prev) =>
        [
          ...prev,
          `[ftsov2] xrp/usd tick ${price.toFixed(6)} — ${new Date()
            .toISOString()
            .slice(11, 19)}`,
        ].slice(-40)
      );
    }
  }, [tick, price, live]);

  return (
    <section className="mx-auto max-w-6xl px-6 pb-6">
      <div className="border border-white/10 bg-[#0D0D10]">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/30">
            audit feed
          </span>
          <span className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/30">
            <span className="live-dot" />
            {live ? "streaming" : "paused"}
          </span>
        </div>
        <div className="max-h-48 space-y-1 overflow-hidden px-4 py-3">
          {logs.map((l, i) => (
            <p key={i} className="log-line">
              <span className="log-ts">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={
                  l.includes("tick") || l.includes("resolved")
                    ? "log-ok"
                    : ""
                }
              >
                {l}
              </span>
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
