import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";

export default function HeaderBar({
  tab,
  onTab,
  title,
  countLabel,
  onNewOrder,
}: {
  tab: "all" | "active" | "due";
  onTab: (t: "all" | "active" | "due") => void;
  title: string;
  countLabel: string;
  onNewOrder: () => void;
}) {
  return (
    <div className="border-b bg-background">
      <div className="flex h-[52px] items-center gap-4 px-4 sm:px-6">
        <h1 className="font-body text-[15px] font-semibold text-foreground">{title}</h1>

        <div className="ml-2 flex items-center rounded-md bg-muted p-0.5">
          {(["all", "active", "due"] as const).map((t) => (
            <button
              key={t}
              onClick={() => onTab(t)}
              className={cn(
                "rounded-[6px] px-3 py-1 font-body text-[12.5px] transition-colors",
                tab === t
                  ? "bg-background font-medium text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t === "all" ? "All" : t === "active" ? "Active" : "Due"}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <Button size="sm" onClick={onNewOrder} className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New order
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t px-4 py-1.5 sm:px-6">
        <span className="rounded-full border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
          {countLabel}
        </span>
        <span className="font-body text-[12px] text-muted-foreground">Grouped by status</span>
      </div>
    </div>
  );
}
