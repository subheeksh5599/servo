const ITEMS = [
  "SIGN ONCE",
  "FDC ATTESTS",
  "FXRP MINTS",
  "AGENT ROUTES",
  "RECEIPT ON-CHAIN",
  "ONE SIGNATURE",
  "NON-CUSTODIAL",
];

export default function Marquee() {
  const group = ITEMS.join("  ·  ");
  return (
    <div className="marquee border-y border-paper/10 py-5">
      <div className="marquee__inner font-mono text-xs uppercase tracking-[0.3em] text-paper/30">
        <span className="px-4">{group}</span>
        <span className="px-4">{group}</span>
      </div>
    </div>
  );
}
