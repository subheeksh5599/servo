"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import type { ServoData, Venue, Receipt } from "./types";

/* ---------- shared empty state ---------- */

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="flex flex-col items-center gap-3 border-dashed bg-card/50 px-6 py-16 text-center shadow-none">
      <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
      <CardDescription className="max-w-md leading-relaxed">{body}</CardDescription>
    </Card>
  );
}

/* ---------- venues ---------- */

export function VenuesView({ data }: { data: ServoData }) {
  const rows = data.venues as Venue[];
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <p className="font-body text-[13px] text-muted-foreground">
        Adapters route FXRP into yield vaults. Rates below are read on-chain
        (exchangeRate() · convertToAssets(1e18)).
      </p>
      <Card className="shadow-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Venue</TableHead>
              <TableHead className="text-right">Rate (1e18)</TableHead>
              <TableHead className="hidden md:table-cell">Adapter</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.deployed && rows.length > 0 ? (
              rows.map((v) => (
                <TableRow key={v.venueId}>
                  <TableCell className="font-mono text-[12px] text-muted-foreground">V-{v.venueId}</TableCell>
                  <TableCell className="font-medium">{v.name}</TableCell>
                  <TableCell className="text-right font-mono text-[12px]">{(Number(v.rate) / 1e18).toFixed(6)}</TableCell>
                  <TableCell className="hidden truncate font-mono text-[11px] text-muted-foreground md:table-cell">
                    {v.adapter}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center font-body text-[13px] text-muted-foreground">
                  {data.deployed
                    ? "No venue adapters registered on the controller."
                    : "Not deployed yet — venues appear after forge script script/Deploy.s.sol."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

/* ---------- receipts ---------- */

export function ReceiptsView({ data }: { data: ServoData }) {
  const rows = data.receipts as Receipt[];
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <p className="font-body text-[13px] text-muted-foreground">
        ExecutionReceipt events from the controller — amount, price, route,
        timestamp, tx hash.
      </p>
      <Card className="shadow-none">
        {rows.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Order</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="hidden text-right sm:table-cell">Price (1e6)</TableHead>
                <TableHead className="text-right">Time (UTC)</TableHead>
                <TableHead className="hidden lg:table-cell">Tx hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice().reverse().map((r, i) => (
                <TableRow key={`${r.txHash}-${i}`}>
                  <TableCell className="font-mono text-[12px] text-muted-foreground">
                    SRV-{String(r.orderId).padStart(3, "0")}
                  </TableCell>
                  <TableCell className="max-w-[280px] truncate font-medium">
                    {r.amountDrops} drops → venue {r.venueId}
                  </TableCell>
                  <TableCell className="hidden text-right font-mono text-[12px] sm:table-cell">{r.priceXrpUsd}</TableCell>
                  <TableCell className="text-right font-mono text-[11px] text-muted-foreground">
                    {new Date(r.timestamp * 1000).toISOString().slice(0, 16).replace("T", " ")}
                  </TableCell>
                  <TableCell className="hidden truncate font-mono text-[11px] text-muted-foreground lg:table-cell">
                    {r.txHash}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <CardContent className="py-10 text-center font-body text-[13px] text-muted-foreground">
            No receipts yet — they appear here the moment an order executes.
          </CardContent>
        )}
      </Card>
    </div>
  );
}

/* ---------- agent ---------- */

export function AgentView({ data }: { data: ServoData }) {
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <p className="font-body text-[13px] text-muted-foreground">
        The strategy agent scores venues by realized APY, executes at ≥70%
        confidence, and asks for one signature below it.
      </p>
      <Card className="shadow-none">
        <CardContent className="space-y-2 p-4 font-mono text-[12px] leading-relaxed text-muted-foreground">
          <p className="text-muted-foreground/70"># agent — no decisions logged yet</p>
          <p>threshold: 70% · tick: 60s · venues scored: {data.venues.length}</p>
          <p>orders watched: {data.orders.length}</p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------- settings ---------- */

export function SettingsView({ data }: { data: ServoData }) {
  const rows: [string, string][] = [
    ["Registry", data.registry ?? "not configured"],
    ["Controller", data.controller ?? "not configured"],
    ["Deployed", data.deployed ? "true" : "false"],
  ];
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <p className="font-body text-[13px] text-muted-foreground">
        Deployed contracts and environment.
      </p>
      <Card className="shadow-none">
        <Table>
          <TableBody>
            {rows.map(([k, v]) => (
              <TableRow key={k}>
                <TableCell className="w-40 font-body text-[13px] font-medium">{k}</TableCell>
                <TableCell className="font-mono text-[12px] text-muted-foreground">{v}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      {data.note && (
        <Card className="shadow-none">
          <CardContent className="p-4 font-body text-[12.5px] leading-relaxed text-muted-foreground">
            {data.note}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ---------- new order dialog (shared) ---------- */

const ORDER_STEPS = [
  ["1", "Pay", "Send XRP to the Servo receiving address with a Servo memo. The memo carries cadence, amount, venue and strategy inside the payment itself."],
  ["2", "Attested", "The Flare Data Connector certifies your payment on-chain in about 90 seconds."],
  ["3", "Registered", "The watcher submits the proof; your standing order appears in this list."],
  ["4", "Running", "The agent executes on schedule: FTSO-priced, routed to the best venue, receipted on-chain."],
];

export function NewOrderDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-body">Create an order</DialogTitle>
          <DialogDescription>
            No form. A standing order is created by one XRPL payment with a
            Servo memo — the payment IS the instruction.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {ORDER_STEPS.map(([n, t, d]) => (
            <div key={n} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[11px] text-primary">
                {n}
              </span>
              <div>
                <p className="font-body text-[13px] font-medium">{t}</p>
                <p className="font-body text-[12px] leading-relaxed text-muted-foreground">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- loading skeleton ---------- */

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Card className="shadow-none">
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
