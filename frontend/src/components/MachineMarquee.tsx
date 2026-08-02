const ITEMS = [
  "SIGN ONCE",
  "FDC ATTESTS",
  "FXRP MINTS",
  "AGENT ROUTES",
  "RECEIPT ON-CHAIN",
  "ONE SIGNATURE",
  "NON-CUSTODIAL",
];

export default function MachineMarquee() {
  const group = ITEMS.map((t) => `<span class="text-outline">${t}</span>`).join(
    '<span class="mx-6 text-paper/25">·</span>'
  );
  return (
    <div className="marquee border-y border-paper/10 py-6">
      <div
        className="marquee__inner font-display text-2xl font-bold uppercase tracking-[0.08em] sm:text-3xl"
        dangerouslySetInnerHTML={{ __html: `<span>${group}</span><span>${group}</span>` }}
      />
    </div>
  );
}
