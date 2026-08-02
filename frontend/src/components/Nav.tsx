"use client";

import useXrpPrice from "@/hooks/useXrpPrice";
import { Badge } from "@/components/ui/badge";

export default function Nav() {
  const { price, live } = useXrpPrice();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-display text-lg font-bold tracking-tight">
          <span className="text-primary">_</span>servo
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
          <a href="#pipeline" className="transition-colors hover:text-foreground">
            Pipeline
          </a>
          <a href="#protocols" className="transition-colors hover:text-foreground">
            Why Flare
          </a>
          <a href="#roadmap" className="transition-colors hover:text-foreground">
            Roadmap
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Badge variant={live ? "live" : "secondary"} className="font-mono">
            <span className={`live-dot ${live ? "" : "opacity-40"}`} />
            {price !== null ? `$${price.toFixed(4)} XRP` : "feed offline"}
          </Badge>
          <a
            href="https://github.com/subheeksh5599/servo"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground sm:block"
          >
            Source
          </a>
        </div>
      </div>
    </header>
  );
}
