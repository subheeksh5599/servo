"use client";

import useXrpPrice from "./useXrpPrice";

export default function ConsoleNav() {
  const { price, live } = useXrpPrice();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0B0E]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <a href="#top" className="font-mono text-sm text-white">
          <span className="text-[#09FD67]">_</span>standing-orders
        </a>
        <div className="flex items-center gap-4 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/40">
          <span className="hidden items-center gap-2 sm:flex">
            <span className={`live-dot ${live ? "" : "opacity-30"}`} />
            {live ? "LIVE" : "OFFLINE"}
          </span>
          <span className="hidden md:inline text-white/60">
            XRP/USD {price !== null ? price.toFixed(6) : "—"}
          </span>
          <a
            href="https://github.com/subheeksh5599/standing-orders"
            target="_blank"
            rel="noopener noreferrer"
            className="chip chip-dim transition-colors hover:border-[#09FD67]/50 hover:text-[#09FD67]"
          >
            Source
          </a>
        </div>
      </div>
    </header>
  );
}
