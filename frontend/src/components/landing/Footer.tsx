export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-paper px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <a href="#top" className="display text-3xl text-charcoal">
          servo<span className="text-butter">.</span>
        </a>
        <div className="flex flex-wrap items-center gap-6 font-body text-sm font-medium text-charcoal/60">
          <a href="https://github.com/subheeksh5599/servo" target="_blank" rel="noopener noreferrer" className="hover:text-charcoal">
            GitHub
          </a>
          <a href="https://dev.flare.network/" target="_blank" rel="noopener noreferrer" className="hover:text-charcoal">
            Flare Dev Hub
          </a>
          <a href="/dashboard" className="hover:text-charcoal">
            Dashboard
          </a>
          <span className="font-mono text-xs text-charcoal/40">
            FSA · FAssets v1.3 · FDC · FTSO v2 — non-custodial
          </span>
        </div>
      </div>
    </footer>
  );
}
