export default function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-bold tracking-tight">
            <span className="text-primary">_</span>servo
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://github.com/subheeksh5599/servo"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href="https://dev.flare.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Flare Dev Hub
            </a>
            <span className="font-mono text-xs text-muted-foreground/60">
              Flare Summer Signal 2026 · Bounty 1
            </span>
          </div>
        </div>
      </div>
      <div className="select-none px-2 pb-2 text-center font-display text-[10vw] font-bold leading-[0.85] tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_hsl(var(--border))]">
        SERVO<span className="text-primary [-webkit-text-stroke:0px]">_</span>
      </div>
    </footer>
  );
}
