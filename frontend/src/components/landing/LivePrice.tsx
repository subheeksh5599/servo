"use client";

import { useEffect, useState } from "react";

// Live FTSO v2 XRP/USD readout (via /api/xrp serverless JSON-RPC).
export default function LivePrice({ className }: { className?: string }) {
  const [price, setPrice] = useState<number | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let m = true;
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/xrp", { cache: "no-store" });
        const j = await res.json();
        if (m && j?.ok) {
          setPrice(j.price);
          setLive(true);
        }
      } catch {
        /* offline */
      }
    };
    fetchPrice();
    const iv = setInterval(fetchPrice, 20000);
    return () => {
      m = false;
      clearInterval(iv);
    };
  }, []);

  return (
    <div className={`font-mono ${className ?? ""}`}>
      {live && price !== null ? `$${price.toFixed(6)}` : "loading"}
    </div>
  );
}
