import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Bitcoin, Undo2, Lock } from "lucide-react";

const ITEMS = [
  {
    icon: Bitcoin,
    label: "FBTC",
    name: "Standing orders for bitcoin",
    desc: "FAssets v2 brings FBTC, FDOGE, FLTC. The same automation, architected for the next assets from day one.",
  },
  {
    icon: Undo2,
    label: "REDEEM",
    name: "Auto-redeem back to XRPL",
    desc: "On schedule or on price target, FXRP redeems to native XRP in your wallet. The loop closes.",
  },
  {
    icon: Lock,
    label: "FCC",
    name: "Private strategy execution",
    desc: "The agent's strategy logic moves inside Flare Confidential Compute — sealed keys, signed execution proofs.",
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="mx-auto max-w-6xl px-6 py-28">
      <p className="sec-label reveal">Roadmap</p>
      <h2 className="reveal mt-5 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
        After the signal
      </h2>

      <div className="reveal mt-14 grid gap-4 md:grid-cols-3">
        {ITEMS.map((it) => (
          <Card
            key={it.label}
            className="border-border/80 bg-card/60 transition-all hover:border-primary/40"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary">
                  <it.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground">
                  {it.label}
                </span>
              </div>
              <CardTitle className="pt-3 font-display leading-snug">
                {it.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {it.desc}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
