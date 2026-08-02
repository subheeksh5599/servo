"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Priority, StatusRing, LabelPill, Avatar, Unassigned } from "./Glyphs";
import { EmptyState } from "./Views";
import type { ServoData, Order } from "./types";

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
    if (tab === "active" && o.status === "paused") return false;
    if (tab === "due" && o.status !== "due") return false;
    return true;
  });

  const groups = [
    { key: "due", label: "Due now", icon: <StatusRing status="due" />, rows: visible.filter((o) => o.status === "due") },
    { key: "running", label: "Running", icon: <StatusRing status="running" />, rows: visible.filter((o) => o.status === "running") },
    { key: "paused", label: "Paused", icon: <StatusRing status="paused" />, rows: visible.filter((o) => o.status === "paused") },
  ].filter((g) => g.rows.length > 0);

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {!data.deployed && (
        <EmptyState
          title="Registry not configured"
          body="Deploy the contracts on Coston2 (forge script script/Deploy.s.sol), then set SERVO_REGISTRY / SERVO_CONTROLLER. Orders you create with one XRPL signature will appear here — from real attestations, nothing mocked."
        />
      )}
      {data.deployed && orders.length === 0 && (
        <EmptyState
          title="No standing orders yet"
          body="Send an XRPL payment with a Servo memo — the watcher attests it via FDC and this list fills with real orders."
        />
      )}
      {data.deployed && orders.length > 0 && groups.length === 0 && (
        <EmptyState title="Nothing in this view" body="Change the segment to see other orders." />
      )}

      {groups.map((g) => (
        <Card key={g.key} className="shadow-none">
          <div className="flex items-center gap-2 px-3 py-2">
            <button
              onClick={() => setCollapsed((c) => ({ ...c, [g.key]: !c[g.key] }))}
              className="flex items-center gap-2"
            >
              <ChevronDown size={13} className={cn("text-muted-foreground transition-transform", collapsed[g.key] && "-rotate-90")} />
              {g.icon}
              <span className="font-body text-[13px] font-medium">{g.label}</span>
              <span className="font-mono text-[12px] text-muted-foreground">{g.rows.length}</span>
            </button>
            <Plus size={13} className="ml-1 hidden text-muted-foreground group-hover:block" />
          </div>
          {!collapsed[g.key] && (
            <div className="border-t">
              {g.rows.map((o) => (
                <OrderRow key={o.id} o={o} />
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

function OrderRow({ o }: { o: Order }) {
  return (
    <div className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0 hover:bg-muted/40">
      <Priority level={o.venueId === 0 ? "none" : "high"} />
      <span className="w-[76px] shrink-0 font-mono text-[12px] text-muted-foreground">
        SRV-{String(o.id).padStart(3, "0")}
      </span>
      <StatusRing status={o.status} />
      <div className="min-w-0 flex-1 truncate font-body text-[13.5px] font-medium">
        {o.amountXrp} XRP every {o.cadenceHours}h → {o.venueLabel}
        <span className="ml-2 font-mono text-[11px] font-normal text-muted-foreground">
          {o.totalExecutedDrops} executed · {o.executionCount} runs
        </span>
      </div>
      <div className="hidden items-center gap-1.5 lg:flex">
        <LabelPill text="fxrp" />
        {o.autoExecute ? <LabelPill text="auto" /> : <LabelPill text="sig" />}
      </div>
      <span className="hidden w-[64px] text-right font-body text-[12px] text-muted-foreground sm:block">
        {o.status === "due" ? "now" : o.nextAt}
      </span>
      {o.ownerInitials ? <Avatar initials={o.ownerInitials} /> : <Unassigned />}
    </div>
  );
}
