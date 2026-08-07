"use client";

import Link from "next/link";

const LINKS = [
  { href: "#leak", label: "The leak" },
  { href: "#hidden", label: "What is hidden" },
  { href: "#moves", label: "How it moves" },
  { href: "#verify", label: "Verify" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b hairline bg-[#edf0ee]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="font-display text-xl tracking-tight">
          Servo
        </Link>
        <nav className="hidden items-center gap-7 md:flex" aria-label="Page sections">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] text-[rgba(12,33,40,0.72)] transition-colors hover:text-[#0c2128]"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/subheeksh5599/servo"
            target="_blank"
            rel="noreferrer"
            className="hidden text-[15px] text-[rgba(12,33,40,0.72)] transition-colors hover:text-[#0c2128] sm:block"
          >
            GitHub
          </a>
          <Link
            href="/dashboard"
            className="btn-pill btn-pill-solid px-4 py-1.5 text-[15px]"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </header>
  );
}
