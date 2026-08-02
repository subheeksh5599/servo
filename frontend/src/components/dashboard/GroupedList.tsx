"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Priority, StatusRing, LabelPill, Avatar, AvatarStack, Unassigned } from "./Glyphs";
import type { ServoData, Order } from "./types";

/* ---------- demo structure rows (only rendered when registry has real orders) ---------- */

export default function GroupedList({
  data,
  tab,
}: {
  data: ServoData;
  tab: "all" | "active" | "due";
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const orders: Order[] = (data.orders as unknown as Order[]).map((o): Order => ({
    ...o,
    status: o.active ? (Date.now() / 1000 >= o.nextExecutionAt ? "due" : "running") : "paused",
  }));

  const visible = orders.filter((o) => {
    if (tab === "active") return o.status !== "paused";
    if (tab === "due") return o.status === "due";
    return true;
  });

  const groups = [
    { key: "due", label: "Due now", icon: <StatusRing status="due" />, rows: visible.filter((o) => o.status === "due") },
    { key: "running", label: "Running", icon: <StatusRing status="running" />, rows: visible.filter((o) => o.status === "running") },
    { key: "paused", label: "Paused", icon: <StatusRing status="paused" />, rows: visible.filter((o) => o.status === "paused") },
  ].filter((g) => g.rows.length > 0);

  return (
    <div className="p-4">
      {!data.deployed && (
        <EmptyState
          title="Registry not configured"
          body="Deploy the contracts on Coston2 (forge script script/Deploy.s.sol), then set SERVO_REGISTRY / SERVO_CONTROLLER. Orders you create with one XRPL signature will appear here · from real attestations, nothing mocked."
        />
      )}
      {data.deployed && orders.length === 0 && (
        <EmptyState
          title="No standing orders yet"
          body="Send an XRPL payment with a Servo memo · the watcher attests it via FDC and this list fills with real orders."
        />
      )}
      {data.deployed && orders.length > 0 && groups.length === 0 && (
        <EmptyState title="Nothing in this view" body="Change the segment to see other orders." />
      )}

      {groups.map((g) => (
        <div key={g.key} className="mb-6">
          <div className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-white/5">
            <button onClick={() => setCollapsed((c) => ({ ...c, [g.key]: !c[g.key] }))} className="flex items-center gap-2">
              <ChevronDown size={13} className={cn("text-mist transition-transform", collapsed[g.key] && "-rotate-90")} />
              {g.icon}
              <span className="font-body text-[13px] font-medium text-ink">{g.label}</span>
              <span className="font-mono text-[12px] text-mist">{g.rows.length}</span>
            </button>
            <Plus size={13} className="ml-1 hidden text-mist group-hover:block" />
          </div>
          {!collapsed[g.key] && (
            <div className="mt-1">
              {g.rows.map((o) => (
                <OrderRow key={o.id} o={o} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function OrderRow({ o }: { o: Order }) {
  return (
    <div className="flex items-center gap-3 border-b border-white/7 px-2 py-[9px] transition-colors hover:bg-white/[0.035]">
      <Priority level={o.venueId === 0 ? "none" : "high"} />
      <span className="w-[76px] shrink-0 font-mono text-[12px] text-mist">SRV-{String(o.id).padStart(3, "0")}</span>
      <StatusRing status={o.status} />
      <div className="min-w-0 flex-1 truncate font-body text-[13.5px] font-medium text-ink">
        {o.amountXrp} XRP every {o.cadenceHours}h → {o.venueLabel}
        <span className="ml-2 font-mono text-[11px] font-normal text-mist">
          {o.totalExecutedDrops} executed · {o.executionCount} runs
        </span>
      </div>
      <div className="hidden items-center gap-2 lg:flex">
        <LabelPill text="fxrp" />
        {o.autoExecute ? <LabelPill text="auto" /> : <LabelPill text="sig" />}
        <LabelPill text="mint" />
      </div>
      <span className="hidden w-[64px] text-right font-body text-[12px] text-mist sm:block">
        {o.status === "due" ? "now" : o.nextAt}
      </span>
      {o.ownerInitials ? <Avatar initials={o.ownerInitials} /> : <Unassigned />}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-20 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-mist/50">
        <span className="h-2 w-2 rounded-full bg-mist/50" />
      </span>
      <p className="font-body text-[14px] font-medium text-ink">{title}</p>
      <p className="max-w-md font-body text-[13px] leading-relaxed text-mist">{body}</p>
    </div>
  );
}
