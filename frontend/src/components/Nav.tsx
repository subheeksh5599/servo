"use client";

export default function Nav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-paper/10 bg-ink/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-mono text-sm tracking-tight text-paper">
          <span className="text-accent">_</span>standing-orders
        </a>
        <nav className="hidden items-center gap-8 font-mono text-xs uppercase tracking-[0.18em] text-paper/50 sm:flex">
          <a href="#blueprint" className="transition-colors hover:text-paper">
            Blueprint
          </a>
          <a href="#flare" className="transition-colors hover:text-paper">
            Why Flare
          </a>
          <a href="#roadmap" className="transition-colors hover:text-paper">
            Roadmap
          </a>
        </nav>
        <a
          href="https://github.com/subheeksh5599/standing-orders"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm border border-paper/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-paper transition-colors hover:border-accent hover:text-accent"
        >
          View code
        </a>
      </div>
    </header>
  );
}
