import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="border-b border-white/7">
      <div className="flex h-[52px] items-center gap-4 px-6">
        <span className="font-body text-[15px] font-medium text-ink">{title}</span>

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

        <button
          onClick={onNewOrder}
          className="ml-auto flex items-center gap-1.5 rounded-md bg-indigo px-3 py-1.5 font-body text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus size={13} /> New order
        </button>
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

export function NewOrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const steps = [
    ["1", "Pay", "Send XRP to the Servo receiving address with a Servo memo. The memo carries cadence, amount, venue and strategy inside the payment itself."],
    ["2", "Attested", "The Flare Data Connector certifies your payment on-chain in about 90 seconds."],
    ["3", "Registered", "The watcher submits the proof; your standing order appears in this list."],
    ["4", "Running", "The agent executes on schedule: FTSO-priced, routed to the best venue, receipted on-chain."],
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-lg border border-white/10 bg-pane p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="font-body text-[15px] font-medium text-ink">Create an order</p>
          <button onClick={onClose} className="text-mist hover:text-ink">
            <X size={16} />
          </button>
        </div>
        <p className="mt-1 font-body text-[13px] text-mist">
          No form. A standing order is created by one XRPL payment with a Servo
          memo — the payment IS the instruction.
        </p>
        <div className="mt-5 space-y-4">
          {steps.map(([n, t, d]) => (
            <div key={n} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo/20 font-mono text-[11px] text-indigo">
                {n}
              </span>
              <div>
                <p className="font-body text-[13px] font-medium text-ink">{t}</p>
                <p className="font-body text-[12px] leading-relaxed text-mist">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-md bg-indigo py-2 font-body text-[13px] font-medium text-white hover:opacity-90"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
