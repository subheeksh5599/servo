export default function Footer() {
  return (
    <footer className="border-t border-paper/10 px-6 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-sm text-paper">
            <span className="text-accent">_</span>standing-orders
          </p>
          <p className="mt-2 font-mono text-xs text-paper/40">
            Built for Flare Summer Signal 2026 — Bounty 1, Interoperable Asset
            Products
          </p>
        </div>
        <div className="flex items-center gap-8 font-mono text-xs uppercase tracking-[0.18em] text-paper/50">
          <a
            href="https://github.com/subheeksh5599/standing-orders"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-paper"
          >
            GitHub
          </a>
          <a
            href="https://dev.flare.network/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-paper"
          >
            Flare Dev Hub
          </a>
          <span className="text-paper/30">© 2026</span>
        </div>
      </div>
    </footer>
  );
}
