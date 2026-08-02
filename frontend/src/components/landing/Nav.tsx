"use client";

import { useEffect, useState } from "react";

export default function Nav() {
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
    <header className="fixed top-0 left-0 right-0 z-50 h-20 border-b border-charcoal/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <a href="#top" className="display text-3xl text-charcoal">
          servo<span className="text-butter">.</span>
        </a>
        <nav className="hidden items-center gap-8 font-body text-sm font-medium text-charcoal/70 md:flex">
          <a href="#problem" className="transition-colors hover:text-charcoal">Why</a>
          <a href="#features" className="transition-colors hover:text-charcoal">Features</a>
          <a href="#how" className="transition-colors hover:text-charcoal">How it works</a>
          <a href="#architecture" className="transition-colors hover:text-charcoal">Architecture</a>
        </nav>
        <div className="flex items-center gap-4">
          <span className="hidden font-body text-sm font-medium text-charcoal/60 sm:block">
            {live ? `XRP/USD $${price?.toFixed(4)}` : "XRP/USD"}
          </span>
          <a href="/dashboard" className="rounded-full bg-charcoal px-6 py-2 font-body text-sm font-medium text-paper transition-transform hover:scale-105">
            Open console
          </a>
        </div>
      </div>
    </header>
  );
}
