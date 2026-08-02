"use client";

import useXrpPrice from "@/hooks/useXrpPrice";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Signature, ShieldCheck, Coins, Bot, ReceiptText, Wallet } from "lucide-react";

const STEPS = [
  { icon: Wallet, t: "XRPL Wallet", s: "your xrp stays in your account" },
  { icon: Signature, t: "One Signature", s: "fsa · memo intent · gas abstracted" },
  { icon: ShieldCheck, t: "FDC Attest", s: "payment proven on-chain" },
  { icon: Coins, t: "FXRP Mint", s: "fassets v1.3 · destination-tag route" },
  { icon: Bot, t: "Agent Route", s: "best realized yield, confidence ≥ 70%" },
  { icon: ReceiptText, t: "On-chain Receipt", s: "amount · price · route" },
];

export default function Pipeline() {
  const { price, live } = useXrpPrice();

  return (
    <section id="pipeline" className="mx-auto max-w-6xl px-6 py-28">
      <p className="sec-label reveal">The mechanism</p>
      <h2 className="reveal mt-5 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
        One standing order,
        <br />
        <span className="text-primary">six moving parts.</span>
      </h2>

      <div className="reveal mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {STEPS.map((s, i) => (
          <div key={s.t} className="relative flex items-stretch">
            <Card className="flex-1 border-border/80 bg-card/60 backdrop-blur-sm transition-colors hover:border-primary/40">
              <CardContent className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-center justify-between">
                  <s.icon className="h-4 w-4 text-primary" />
                  <span className="font-mono text-[0.625rem] text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <p className="font-display text-sm font-semibold">{s.t}</p>
                  <p className="mt-1.5 font-mono text-[0.6875rem] leading-relaxed text-muted-foreground">
                    {s.s}
                  </p>
                </div>
              </CardContent>
            </Card>
            {i < STEPS.length - 1 && (
              <ArrowRight className="absolute -right-2.5 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground/40 lg:block" />
            )}
          </div>
        ))}
      </div>

      <div className="reveal mt-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card/40 px-5 py-4">
        <Badge variant={live ? "live" : "secondary"} className="font-mono">
          <span className={`live-dot ${live ? "" : "opacity-40"}`} />
          {live ? "live" : "offline"}
        </Badge>
        <span className="font-mono text-sm text-muted-foreground">
          FTSO v2 · XRP/USD{" "}
          <span className="text-foreground">
            {price !== null ? price.toFixed(6) : "—"}
          </span>
        </span>
        <span className="hidden font-mono text-xs text-muted-foreground/60 sm:inline">
          every execution is priced on-chain, nothing mocked
        </span>
      </div>
    </section>
  );
}
