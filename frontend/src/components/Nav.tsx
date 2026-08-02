"use client";

import useXrpPrice from "@/hooks/useXrpPrice";
import Logo from "@/components/Logo";
import { Badge } from "@/components/ui/badge";

export default function Nav() {
  const { price, live } = useXrpPrice();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="flex items-center gap-2.5 text-foreground">
          <Logo className="h-6 w-6 text-foreground" />
          <span className="font-display text-lg font-bold tracking-tight">
            servo
          </span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground sm:flex">
          <a href="#mechanism" className="transition-colors hover:text-foreground">
            Mechanism
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
