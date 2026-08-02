import { Plus, SlidersHorizontal, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HeaderBar({
  tab,
  onTab,
  title,
  countLabel,
}: {
  tab: "all" | "active" | "due";
  onTab: (t: "all" | "active" | "due") => void;
  title: string;
  countLabel: string;
}) {
  return (
    <div className="border-b border-white/7">
      <div className="flex h-[52px] items-center gap-4 px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-indigo/20 text-[9px] font-medium text-indigo">
            SV
          </span>
          <span className="font-body text-[15px] font-medium text-ink">{title}</span>
        </div>

        <div className="ml-4 flex overflow-hidden rounded-md border border-white/7">
          {(["all", "active", "due"] as const).map((t) => (
            <button
              key={t}
              onClick={() => onTab(t)}
              className={cn(
                "px-3 py-1 font-body text-[13px] capitalize transition-colors",
                tab === t ? "bg-white/10 font-medium text-ink" : "text-mist hover:text-ink"
              )}
            >
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-body text-[13px] text-mist transition-colors hover:text-ink">
            <Filter size={13} /> Filter
          </button>
          <button className="flex items-center gap-1.5 rounded-md px-2.5 py-1 font-body text-[13px] text-mist transition-colors hover:text-ink">
            <SlidersHorizontal size={13} /> Display
          </button>
          <button className="ml-2 flex items-center gap-1.5 rounded-md bg-indigo px-3 py-1.5 font-body text-[13px] font-medium text-white transition-opacity hover:opacity-90">
            <Plus size={13} /> New order
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-white/7 px-6 py-1.5">
        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] text-mist">
          {countLabel}
        </span>
        <span className="font-body text-[12px] text-mist">Grouped by status</span>
      </div>
    </div>
  );
}
