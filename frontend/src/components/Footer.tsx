export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-sm text-white">
            <span className="text-[#09FD67]">_</span>standing-orders
          </p>
          <div className="flex items-center gap-6 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-white/40">
            <a
              href="https://github.com/subheeksh5599/standing-orders"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#09FD67]"
            >
              GitHub
            </a>
            <a
              href="https://dev.flare.network/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#09FD67]"
            >
              Flare Dev Hub
            </a>
            <span className="text-white/25">
              Flare Summer Signal 2026 · Bounty 1
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
