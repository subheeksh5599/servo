import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KeyRound, Coins, ShieldCheck, LineChart } from "lucide-react";

const PROTOCOLS = [
  {
    icon: KeyRound,
    label: "FSA",
    name: "Flare Smart Accounts",
    desc: "Your XRPL wallet is the control layer. One signature authorizes execution on Flare — gas abstracted, custody untouched.",
  },
  {
    icon: Coins,
    label: "FAssets v1.3",
    name: "Direct minting",
    desc: "Destination-tag routing turns a normal XRP send into minted FXRP. No agent selection, no separate bridge step.",
  },
  {
    icon: ShieldCheck,
    label: "FDC",
    name: "Flare Data Connector",
    desc: "Proves every XRPL payment on-chain before anything moves. The trust anchor for automation.",
  },
  {
    icon: LineChart,
    label: "FTSO v2",
    name: "Time Series Oracle",
    desc: "Enshrined price feeds price every mint and route decision — no external oracle, no single point of failure.",
  },
];

export default function Protocols() {
  return (
    <section id="protocols" className="mx-auto max-w-6xl px-6 py-28">
      <p className="sec-label reveal">Why Flare</p>
      <h2 className="reveal mt-5 font-display text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
        Four enshrined protocols.
        <br />
        <span className="text-primary">One standing order.</span>
      </h2>

      <div className="reveal mt-14 grid gap-4 sm:grid-cols-2">
        {PROTOCOLS.map((p) => (
          <Card
            key={p.label}
            className="group border-border/80 bg-card/60 transition-all hover:border-primary/40 hover:shadow-[0_0_40px_-12px_hsl(248_75%_64%_/_0.35)]"
          >
            <CardHeader className="flex-row items-start justify-between space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary">
                  <p.icon className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="font-display">{p.name}</CardTitle>
              </div>
              <Badge variant="live" className="font-mono text-[0.625rem]">
                <span className="live-dot" /> live
              </Badge>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {p.desc}
              </CardDescription>
              <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-muted-foreground/70">
                {p.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
