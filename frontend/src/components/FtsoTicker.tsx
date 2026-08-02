"use client";

import { useEffect, useState } from "react";

export default function FtsoTicker() {
  const [price, setPrice] = useState<number | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/xrp", { cache: "no-store" });
        const json = await res.json();
        if (mounted && json?.ok) {
          setPrice(json.price);
          setLive(true);
        } else if (mounted) {
          setLive(false);
        }
      } catch {
        if (mounted) setLive(false);
      }
    };

    fetchPrice();
    const iv = window.setInterval(fetchPrice, 20000);
    return () => {
      mounted = false;
      window.clearInterval(iv);
    };
  }, []);

  return (
    <div className="flex items-center gap-3 border-t border-paper/10 py-3">
      <span className="dim-label">Live feed</span>
      <span className="h-1.5 w-1.5 rounded-full bg-accent blink" />
      <span className="font-mono text-xs tracking-[0.15em] text-paper/70">
        XRP/USD{" "}
        <span className="text-paper">
          {price !== null ? price.toFixed(6) : "—"}
        </span>
      </span>
      <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.2em] text-paper/30 sm:inline">
        {live ? "read live from Flare FTSO v2" : "ftsov2 feed offline"}
      </span>
    </div>
  );
}
