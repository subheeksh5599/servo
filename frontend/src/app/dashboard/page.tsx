"use client";

import { useEffect, useState } from "react";
import Sidebar, { type View } from "@/components/dashboard/Sidebar";
import HeaderBar from "@/components/dashboard/HeaderBar";
import GroupedList from "@/components/dashboard/GroupedList";
import CommandSearch, { type CommandAction } from "@/components/dashboard/CommandSearch";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import { VenuesView, ReceiptsView, AgentView, SettingsView, NewOrderDialog, DashboardSkeleton } from "@/components/dashboard/Views";
import type { ServoData, Order } from "@/components/dashboard/types";

// venue display names resolve from on-chain data when the registry is
// deployed; V{id} is a structural id, never a fabricated name.
function venueName(venueId: number, data: ServoData): string {
  const v = data.venues.find((x) => x.venueId === venueId);
  return v?.name || `V${venueId}`;
}

export default function Dashboard() {
  const [view, setView] = useState<View>("orders");
  const [tab, setTab] = useState<"all" | "active" | "due">("all");
  const [data, setData] = useState<ServoData | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [live, setLive] = useState(false);
  const [newOrderOpen, setNewOrderOpen] = useState(false);

  const handleCommand = (cmd: CommandAction) => {
    if (cmd.newOrder) {
      setNewOrderOpen(true);
      return;
    }
    if (cmd.view) setView(cmd.view);
  };

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
      venueLabel: venueName(Number(rec.venueId ?? 0), data ?? ({} as ServoData)),
      autoExecute: Boolean(rec.autoExecute),
      active: Boolean(rec.active),
      nextExecutionAt: Number(rec.nextExecutionAt ?? 0),
      totalExecutedDrops: rec.totalExecutedDrops ?? "0",
      executionCount: Number(rec.executionCount ?? 0),
      ownerInitials: rec.ownerEvm ? rec.ownerEvm.slice(2, 4).toUpperCase() : "",
      nextAt: rec.nextExecutionAt
        ? new Date(Number(rec.nextExecutionAt) * 1000).toISOString().slice(5, 16).replace("T", " ")
        : "",
      status: "paused",
    };
  });

  const countLabel = data?.deployed ? `${orders.length} orders` : "0 orders";

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Sidebar
        view={view}
        onView={setView}
        orderCount={data?.deployed ? orders.length : null}
        live={live}
        price={price}
        searchBar={<CommandSearch onCommand={handleCommand} />}
        profileCard={<ProfileDropdown onNavigate={(v) => setView(v)} onConnect={() => setNewOrderOpen(true)} />}
      />
      <main className="ml-[240px] min-h-screen bg-background">
        <HeaderBar
          tab={tab}
          onTab={setTab}
          title={view === "orders" ? "Orders" : view === "receipts" ? "Receipts" : view === "venues" ? "Venues" : view === "agent" ? "Agent" : "Settings"}
          countLabel={countLabel}
          onNewOrder={() => setNewOrderOpen(true)}
        />
        {data === null && <DashboardSkeleton />}
        {data !== null && view === "orders" && <GroupedList data={{ ...data, orders } as unknown as ServoData} tab={tab} />}
        {data !== null && view === "receipts" && <ReceiptsView data={data} />}
        {data !== null && view === "venues" && <VenuesView data={data} />}
        {data !== null && view === "agent" && <AgentView data={data} />}
        {data !== null && view === "settings" && <SettingsView data={data} />}
      </main>
      <NewOrderDialog open={newOrderOpen} onOpenChange={setNewOrderOpen} />
    </div>
  );
}
