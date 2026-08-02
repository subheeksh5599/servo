"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wifi, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Structural card types — a card becomes a real standing order only when a
// verified payment registers it. No fabricated values here.
interface CardData {
  id: string;
  type: "gold" | "silver" | "platinum";
  kind: string;
  line: string;
  owner: string;
  cycle: string;
}

const CARDS: CardData[] = [
  { id: "1", type: "gold", kind: "ORDER", line: "cadence · amount · venue", owner: "YOURS", cycle: "FOREVER" },
  { id: "2", type: "silver", kind: "VAULT", line: "FXRP · best realized yield", owner: "YOURS", cycle: "AUTO" },
  { id: "3", type: "platinum", kind: "AGENT", line: "routes at ≥70% confidence", owner: "YOURS", cycle: "SIGNED" },
];

function WalletCard({
  data,
  index,
  total,
  isActive,
  isHovered,
  onClick,
}: {
  data: CardData;
  index: number;
  total: number;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
}) {
  const isGold = data.type === "gold";
  const isPlatinum = data.type === "platinum";
  const yOffset = isActive ? 60 : isHovered ? -150 + index * 55 : index * 14;
  const zIndex = isActive ? 40 : 10 + index;
  const scale = isActive ? 1.05 : 1 - (total - 1 - index) * 0.05;
  const brightness = isActive ? 1 : isHovered ? 1 : 0.6 - (total - 1 - index) * 0.12;
  const rotateX = isActive ? 0 : isHovered ? -5 : 0;

  return (
    <motion.div
      layout
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      initial={false}
      animate={{ y: yOffset, scale, zIndex, rotateX, filter: `brightness(${brightness})` }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn(
        "absolute left-0 w-full h-[200px] rounded-xl cursor-pointer shadow-xl overflow-hidden transform-gpu border border-white/10",
        isGold && "bg-gradient-to-br from-[#FFE17C] via-[#D9A93F] to-[#8A6A1F]",
        data.type === "silver" && "bg-gradient-to-br from-[#E2E2E2] via-[#9CA3AF] to-[#4B5563]",
        isPlatinum && "bg-gradient-to-br from-[#171E19] via-[#272727] to-[#0B0D0C]"
      )}
      style={{ transformStyle: "preserve-3d", top: "-45px", transformOrigin: "bottom center" }}
    >
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,#ffffff66,transparent_60%)] pointer-events-none" />
      <div className="relative p-5 h-full flex flex-col justify-between font-mono select-none">
        <div className="flex justify-between items-start">
          <span className={cn("display text-sm tracking-wide", isGold || data.type === "silver" ? "text-charcoal" : "text-butter")}>
            servo
          </span>
          <Wifi className={cn("w-5 h-5 rotate-90", isGold || data.type === "silver" ? "text-charcoal/60" : "text-butter/60")} />
        </div>
        <div className="space-y-2">
          <p className={cn("text-lg tracking-widest font-bold", isGold || data.type === "silver" ? "text-charcoal" : "text-paper/80")}>
            {data.kind}
          </p>
          <div className="flex justify-between items-end">
            <div>
              <p className={cn("text-[9px] uppercase opacity-70", isGold || data.type === "silver" ? "text-charcoal" : "text-paper/50")}>
                {data.line}
              </p>
              <p className={cn("text-xs font-bold tracking-wide uppercase", isGold || data.type === "silver" ? "text-charcoal" : "text-paper")}>
                {data.owner}
              </p>
            </div>
            <div className="text-right">
              <p className={cn("text-[9px] uppercase opacity-70", isGold || data.type === "silver" ? "text-charcoal" : "text-paper/50")}>
                duration
              </p>
              <p className={cn("text-xs font-bold", isGold || data.type === "silver" ? "text-charcoal" : "text-paper")}>{data.cycle}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Wallet() {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState(false);
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
    <section id="wallet" className="bg-[#051810] px-6 py-28 text-paper">
      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <div>
          <p className="font-body text-xs uppercase tracking-widest text-sage/60">
            The wallet
          </p>
          <h2 className="display mt-4 text-6xl text-paper md:text-7xl">
            Your money.
            <br />
            <span className="text-butter">Your cards.</span>
          </h2>
          <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-sage">
            Each card is a standing order you create with one XRPL signature.
            Sign one and your cards fill with real data. Until then, the
            wallet shows the live price and nothing more.
          </p>
          <p className="mt-8 flex items-center gap-3 font-mono text-sm text-sage/70">
            <span className="live-dot" />
            XRP/USD{" "}
            <span className="text-butter">
              {live && price !== null ? `$${price.toFixed(6)}` : "loading"}
            </span>
            <span className="text-sage/40">live from FTSO v2</span>
          </p>
        </div>

        <div className="relative flex h-[420px] flex-col items-center justify-center">
          <div className="absolute top-[-20%] left-[-20%] h-[140%] w-[140%] bg-[radial-gradient(circle_at_50%_50%,rgba(21,50,40,0.8)_0%,rgba(5,24,16,1)_70%)] pointer-events-none" />
          <div
            className="relative z-10 w-80 md:w-96"
            onClick={() => setActive(null)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="relative h-56 md:h-64">
              <div className="absolute inset-x-6 top-0 bottom-0 perspective-1000">
                {CARDS.map((card, i) => (
                  <div key={card.id} className="pointer-events-auto">
                    <WalletCard
                      data={card}
                      index={i}
                      total={CARDS.length}
                      isActive={active === card.id}
                      isHovered={hovered}
                      onClick={() => setActive(active === card.id ? null : card.id)}
                    />
                  </div>
                ))}
              </div>

              <motion.div
                className="absolute inset-0 z-30 flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#141414] text-center shadow-[0_30px_60px_-10px_rgba(0,0,0,0.9)]"
                animate={{ rotateX: hovered || active ? 5 : 0, y: hovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,#ffffff12,transparent_60%)]" />
                <div className="absolute inset-3 rounded-xl border border-dashed border-white/10 opacity-50" />
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5C7066]">
                    XRP/USD · FTSO v2
                  </span>
                  <span className="font-mono text-3xl text-[#E0E0E0]">
                    {live && price !== null ? `$${price.toFixed(6)}` : "—"}
                  </span>
                  <span className="font-body text-xs text-[#5C7066]">
                    sign once · your orders appear here
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          <motion.p
            className="mt-12 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#88A096]/40"
            animate={{ opacity: hovered ? 1 : 0.5 }}
          >
            <ChevronUp size={10} className={hovered ? "animate-bounce" : ""} />
            {active ? "click background to close" : "hover to fan · click to focus"}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
