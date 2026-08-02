"use client";

import { useEffect, useState } from "react";
import Sidebar, { type View } from "@/components/dashboard/Sidebar";
import HeaderBar from "@/components/dashboard/HeaderBar";
import GroupedList from "@/components/dashboard/GroupedList";
import { VenuesView, ReceiptsView, AgentView, SettingsView } from "@/components/dashboard/Views";
import type { ServoData, Order } from "@/components/dashboard/types";

const VENUE_LABELS = ["FXRP", "stXRP", "earnXRP", "V3", "V4"];

export default function Dashboard() {
  const [view, setView] = useState<View>("orders");
  const [tab, setTab] = useState<"all" | "active" | "due">("all");
  const [data, setData] = useState<ServoData | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let m = true;
    (async () => {
      const [servoRes, xrpRes] = await Promise.all([
        fetch("/api/servo", { cache: "no-store" }),
        fetch("/api/xrp", { cache: "no-store" }),
      ]);
      const servo = await servoRes.json();
      const xrp = await xrpRes.json();
      if (m) {
        setData(servo);
        if (xrp.ok) {
          setPrice(xrp.price);
          setLive(true);
        }
      }
    })().catch(() => {
      if (m) setData({ deployed: false, registry: null, controller: null, orders: [], venues: [], receipts: [] });
    });
    return () => {
      m = false;
    };
  }, []);

  // normalize orders
  const orders: Order[] = (data?.orders ?? []).map((o): Order => {
    const rec = o as unknown as Record<string, any>;
    const amountXrp = (Number(rec.amountDrops ?? 0) / 1_000_000).toFixed(2);
    return {
      id: Number(rec.id ?? 0),
      ownerXrpl: rec.ownerXrpl ?? "",
      ownerEvm: rec.ownerEvm ?? "",
      amountXrp,
      cadenceHours: Number(rec.cadenceSeconds ?? 3600) / 3600,
      venueId: Number(rec.venueId ?? 0),
      venueLabel: VENUE_LABELS[Number(rec.venueId ?? 0)] ?? `V${rec.venueId}`,
      autoExecute: Boolean(rec.autoExecute),
      active: Boolean(rec.active),
      nextExecutionAt: Number(rec.nextExecutionAt ?? 0),
      totalExecutedDrops: rec.totalExecutedDrops ?? "0",
      executionCount: Number(rec.executionCount ?? 0),
      ownerInitials: rec.ownerEvm ? rec.ownerEvm.slice(2, 4).toUpperCase() : "",
      nextAt: rec.nextExecutionAt
        ? new Date(Number(rec.nextExecutionAt) * 1000).toISOString().slice(5, 16).replace("T", " ")
        : "—",
      status: "paused",
    };
  });

  const countLabel = data?.deployed ? `${orders.length} orders` : "0 orders";

  return (
    <div className="min-h-screen bg-app font-body text-ink">
      <Sidebar view={view} onView={setView} orderCount={data?.deployed ? orders.length : null} live={live} price={price} />
      <main className="ml-[240px] bg-pane">
        <HeaderBar tab={tab} onTab={setTab} title={view === "orders" ? "Orders" : view === "receipts" ? "Receipts" : view === "venues" ? "Venues" : view === "agent" ? "Agent" : "Settings"} countLabel={countLabel} />
        {view === "orders" && <GroupedList data={{ ...data, orders } as unknown as ServoData} tab={tab} />}
        {view === "receipts" && <ReceiptsView data={data ?? ({} as ServoData)} />}
        {view === "venues" && <VenuesView data={data ?? ({} as ServoData)} />}
        {view === "agent" && <AgentView data={data ?? ({} as ServoData)} />}
        {view === "settings" && <SettingsView data={data ?? ({} as ServoData)} />}
      </main>
    </div>
  );
}
