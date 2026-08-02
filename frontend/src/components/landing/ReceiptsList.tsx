"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface Receipt {
  id: string;
  title: string;
  meta: string;
  amount: string;
  status: "minted" | "routed" | "signed" | "queued";
}

const RECEIPTS: Receipt[] = [
  { id: "RCP-001", title: "25 XRP payment attested by FDC", meta: "real testnet tx E715FA55… · tag 4242", amount: "25 XRP", status: "minted" },
  { id: "RCP-002", title: "FXRP minted via FAssets v1.3", meta: "direct mint · destination-tag routing", amount: "—", status: "minted" },
  { id: "RCP-003", title: "Agent routed to earnXRP", meta: "route decision · confidence from data freshness", amount: "—", status: "routed" },
  { id: "RCP-004", title: "Next run scheduled", meta: "cadence from memo · price from FTSO v2", amount: "—", status: "signed" },
  { id: "RCP-005", title: "Venue switch needs your signature", meta: "below confidence threshold · one signature", amount: "—", status: "queued" },
];

const STATUS_DOT: Record<Receipt["status"], string> = {
  minted: "bg-butter",
  routed: "bg-[#171E19]",
  signed: "bg-sage",
  queued: "bg-charcoal/20",
};

export default function ReceiptsList() {
  const listRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((p) => Math.min(p + 1, RECEIPTS.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((p) => Math.max(p - 1, 0));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <section id="receipts" className="bg-paper px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <p className="font-body text-xs uppercase tracking-widest text-charcoal/50">
          Every run leaves a receipt
        </p>
        <h2 className="display mt-4 text-6xl text-charcoal">
          Prove it,<br />any time.
        </h2>
        <p className="mt-4 font-body text-charcoal/60">
          Arrow keys navigate. Structure of a real receipt — the dashboard
          renders these from actual on-chain events.
        </p>

        <div
          ref={listRef}
          className="relative mt-10 max-h-[420px] overflow-y-auto border border-charcoal/10 p-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-charcoal/20"
        >
          {RECEIPTS.map((r, i) => (
            <Item
              key={r.id}
              index={i}
              receipt={r}
              selected={selected === i}
              onSelect={() => setSelected(i)}
            />
          ))}
          <div className="pointer-events-none sticky bottom-0 h-16 bg-gradient-to-t from-paper to-transparent" />
        </div>
      </div>
    </section>
  );
}

function Item({
  index,
  receipt,
  selected,
  onSelect,
}: {
  index: number;
  receipt: Receipt;
  selected: boolean;
  onSelect: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onClick={onSelect}
      initial={{ scale: 0.72, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.72, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mb-3 cursor-pointer"
    >
      <div
        className={cn(
          "flex items-center justify-between gap-4 rounded-lg border p-4 transition-colors duration-300",
          selected ? "border-butter bg-butter/10" : "border-charcoal/10 bg-[#f8f9fa] hover:border-charcoal/25"
        )}
      >
        <div className="flex items-center gap-4">
          <span className={cn("h-2.5 w-2.5 rounded-full", STATUS_DOT[receipt.status])} />
          <div>
            <p className="display text-base text-charcoal">{receipt.title}</p>
            <p className="font-mono text-xs text-charcoal/50">{receipt.meta}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="display text-sm text-charcoal">{receipt.amount}</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
            {receipt.id}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
