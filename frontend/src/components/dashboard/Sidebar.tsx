"use client";

import { Inbox, Search, Layers, ListChecks, Zap, Settings, Wallet, ChevronDown, MoreHorizontal, Bot, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";

export type View = "orders" | "receipts" | "venues" | "agent" | "settings";

const NAV: { view: View; label: string; icon: typeof Inbox }[] = [
  { view: "orders", label: "Orders", icon: ListChecks },
  { view: "receipts", label: "Receipts", icon: ReceiptText },
  { view: "venues", label: "Venues", icon: Layers },
  { view: "agent", label: "Agent", icon: Bot },
  { view: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  view,
  onView,
  orderCount,
  live,
  price,
}: {
  view: View;
  onView: (v: View) => void;
  orderCount: number | null;
  live: boolean;
  price: number | null;
}) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 flex w-[240px] flex-col border-r border-white/7 bg-rail">
      {/* workspace switcher */}
      <div className="flex h-[52px] items-center gap-2.5 border-b border-white/7 px-4">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-indigo/20 font-body text-xs font-medium text-indigo">
          SV
        </span>
        <span className="flex-1 font-body text-[13px] font-medium text-ink">Servo</span>
        <ChevronDown size={14} className="text-mist" />
        <Inbox size={14} className="text-mist" />
      </div>

      {/* search */}
      <div className="mx-4 mt-3 flex items-center gap-2 rounded-md border border-white/7 px-2.5 py-1.5">
        <Search size={13} className="text-mist" />
        <span className="flex-1 font-body text-[13px] text-mist">Search</span>
        <span className="rounded border border-white/10 px-1 font-mono text-[10px] text-mist">⌘K</span>
      </div>

      {/* primary nav */}
      <nav className="mt-3 space-y-0.5 px-2.5">
        <button
          onClick={() => onView("orders")}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] transition-colors",
            view === "orders" ? "bg-indigo/15 font-medium text-ink" : "text-mist hover:bg-white/5"
          )}
        >
          <ListChecks size={15} />
          Orders
          {orderCount !== null && (
            <span className="ml-auto rounded-full bg-white/10 px-1.5 font-mono text-[11px] text-ink">
              {orderCount}
            </span>
          )}
        </button>
        <button
          onClick={() => onView("receipts")}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] transition-colors",
            view === "receipts" ? "bg-indigo/15 font-medium text-ink" : "text-mist hover:bg-white/5"
          )}
        >
          <ReceiptText size={15} /> Receipts
        </button>
        <button
          onClick={() => onView("venues")}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] transition-colors",
            view === "venues" ? "bg-indigo/15 font-medium text-ink" : "text-mist hover:bg-white/5"
          )}
        >
          <Layers size={15} /> Venues
        </button>
        <button
          onClick={() => onView("agent")}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] transition-colors",
            view === "agent" ? "bg-indigo/15 font-medium text-ink" : "text-mist hover:bg-white/5"
          )}
        >
          <Bot size={15} /> Agent
        </button>
      </nav>

      {/* workspace group */}
      <p className="mt-6 px-5 font-body text-[11px] font-semibold uppercase tracking-wider text-mist/70">
        Network
      </p>
      <nav className="mt-1.5 space-y-0.5 px-2.5">
        <button onClick={() => onView("settings")} className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] transition-colors",
          view === "settings" ? "bg-indigo/15 font-medium text-ink" : "text-mist hover:bg-white/5"
        )}>
          <Wallet size={15} /> Contracts
        </button>
        <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] text-mist transition-colors hover:bg-white/5">
          <Zap size={15} /> FTSO v2
          <span className="ml-auto font-mono text-[11px] text-mist/80">
            {live && price !== null ? `$${price.toFixed(4)}` : ""}
          </span>
        </button>
        <button onClick={() => onView("settings")} className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] text-mist transition-colors hover:bg-white/5">
          <Settings size={15} /> Settings
        </button>
      </nav>

      {/* teams group */}
      <p className="mt-6 px-5 font-body text-[11px] font-semibold uppercase tracking-wider text-mist/70">
        Deployment
      </p>
      <nav className="mt-1.5 space-y-0.5 px-2.5">
        <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] text-mist transition-colors hover:bg-white/5">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-indigo/20 text-[9px] font-medium text-indigo">
            C2
          </span>
          Coston2
          <ChevronDown size={12} className="ml-auto text-mist" />
        </button>
        <div className="space-y-0.5 pl-6">
          <button onClick={() => onView("orders")} className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-1 font-body text-[13px] transition-colors",
            view === "orders" ? "font-medium text-ink" : "text-mist hover:bg-white/5"
          )}>
            Registry
          </button>
          <button onClick={() => onView("venues")} className="flex w-full items-center gap-2 rounded-md px-2 py-1 font-body text-[13px] text-mist transition-colors hover:bg-white/5">
            Venue adapters
          </button>
          <button onClick={() => onView("receipts")} className="flex w-full items-center gap-2 rounded-md px-2 py-1 font-body text-[13px] text-mist transition-colors hover:bg-white/5">
            Receipts
          </button>
        </div>
      </nav>

      {/* user card */}
      <div className="mt-auto flex items-center gap-2.5 border-t border-white/7 p-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-mist/50 font-body text-[10px] text-mist">
          —
        </span>
        <div className="flex-1">
          <p className="font-body text-[13px] font-medium text-ink">Not connected</p>
          <p className="font-body text-[11px] text-mist">connect wallet · sign once</p>
        </div>
        <MoreHorizontal size={15} className="text-mist" />
      </div>
    </aside>
  );
}
