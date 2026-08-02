import { ChevronDown, Zap, Settings, ListChecks, ReceiptText, Layers, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";

export type View = "orders" | "receipts" | "venues" | "agent" | "settings";

const NAV: { view: View; label: string; icon: typeof ListChecks }[] = [
  { view: "orders", label: "Orders", icon: ListChecks },
  { view: "receipts", label: "Receipts", icon: ReceiptText },
  { view: "venues", label: "Venues", icon: Layers },
  { view: "agent", label: "Agent", icon: Bot },
];

export default function Sidebar({
  view,
  onView,
  orderCount,
  live,
  price,
  searchBar,
  profileCard,
}: {
  view: View;
  onView: (v: View) => void;
  orderCount: number | null;
  live: boolean;
  price: number | null;
  searchBar: ReactNode;
  profileCard: ReactNode;
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r bg-sidebar text-sidebar-foreground">
      {/* workspace title */}
      <div className="flex h-[52px] items-center gap-2.5 border-b px-4">
        <span className="flex-1 font-body text-[13px] font-semibold">Servo</span>
        <ChevronDown size={14} className="text-muted-foreground" />
      </div>

      {/* command search */}
      <div className="px-3 pt-3">{searchBar}</div>

      {/* primary nav */}
      <nav className="mt-3 space-y-0.5 px-2.5">
        {NAV.map(({ view: v, label, icon: Icon }) => (
          <button
            key={v}
            onClick={() => onView(v)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] transition-colors",
              view === v
                ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon size={15} />
            {label}
            {v === "orders" && orderCount !== null && (
              <span className="ml-auto rounded-full bg-muted px-1.5 font-mono text-[11px] text-muted-foreground">
                {orderCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <Separator className="my-4" />

      {/* system group */}
      <p className="px-5 font-body text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        System
      </p>
      <nav className="mt-1.5 space-y-0.5 px-2.5">
        <div className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] text-muted-foreground">
          <Zap size={15} /> FTSO v2
          <span className="ml-auto font-mono text-[11px] text-muted-foreground/80">
            {live && price !== null ? `$${price.toFixed(4)}` : "—"}
          </span>
        </div>
        <button
          onClick={() => onView("settings")}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 font-body text-[13px] transition-colors",
            view === "settings"
              ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings size={15} /> Settings
        </button>
      </nav>

      {/* profile card */}
      <div className="mt-auto border-t p-3">{profileCard}</div>
    </aside>
  );
}
