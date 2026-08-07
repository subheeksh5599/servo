import Link from "next/link";

const REGISTRY = "0x3B40edd04B3275868b6362Da1FC706D069379BE6";
const CONTROLLER = "0x1F4592d16215387308928512B2404a9b6541b0d9";
const FDC = "0x906507E0B64bcD494Db73bd0459d1C667e14B933";

export default function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-[#0c2128]">Servo</p>
          <p className="mt-3 max-w-[220px] text-[14px] leading-relaxed text-[rgba(12,33,40,0.6)]">
            Recurring money for XRP on Flare. Built for Flare Summer Signal
            2026.
          </p>
        </div>

        <div>
          <p className="sec-label">Product</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><Link href="/dashboard" className="text-[rgba(12,33,40,0.75)] hover:text-[#0c2128]">Dashboard</Link></li>
            <li><Link href="/dashboard" className="text-[rgba(12,33,40,0.75)] hover:text-[#0c2128]">Orders</Link></li>
            <li><Link href="/dashboard" className="text-[rgba(12,33,40,0.75)] hover:text-[#0c2128]">Venues</Link></li>
            <li><Link href="/dashboard" className="text-[rgba(12,33,40,0.75)] hover:text-[#0c2128]">Agent</Link></li>
          </ul>
        </div>

        <div>
          <p className="sec-label">On-chain</p>
          <ul className="mt-4 space-y-2.5 font-mono text-[12px]">
            <li><a href="https://coston2-explorer.flare.network/address/" className="break-all text-[rgba(12,33,40,0.75)] hover:text-[#0c2128]">Registry {REGISTRY.slice(0, 10)}…</a></li>
            <li><a href="https://coston2-explorer.flare.network/address/" className="break-all text-[rgba(12,33,40,0.75)] hover:text-[#0c2128]">Controller {CONTROLLER.slice(0, 10)}…</a></li>
            <li><a href="https://coston2-explorer.flare.network/address/" className="break-all text-[rgba(12,33,40,0.75)] hover:text-[#0c2128]">FDC {FDC.slice(0, 10)}…</a></li>
          </ul>
        </div>

        <div>
          <p className="sec-label">Source</p>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            <li><a href="https://github.com/subheeksh5599/servo" target="_blank" rel="noreferrer" className="text-[rgba(12,33,40,0.75)] hover:text-[#0c2128]">GitHub</a></li>
            <li><a href="https://dev.flare.network/" target="_blank" rel="noreferrer" className="text-[rgba(12,33,40,0.75)] hover:text-[#0c2128]">Flare docs</a></li>
            <li><a href="https://xrpl.org/" target="_blank" rel="noreferrer" className="text-[rgba(12,33,40,0.75)] hover:text-[#0c2128]">XRPL</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t hairline">
        <p className="mx-auto max-w-6xl px-5 py-5 text-[13px] text-[rgba(12,33,40,0.5)]">
          Live on Coston2. The registry numbers on this page can be read
          straight off the chain.
        </p>
      </div>
    </footer>
  );
}
