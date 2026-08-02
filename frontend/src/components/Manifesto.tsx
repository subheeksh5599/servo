const TEXT =
  "Every week your XRP sits still, it loses ground it could be earning. A standing order makes it move — mint, route, receive, repeat. One signature at setup. One when the agent asks. An on-chain receipt for everything in between.";

export default function Manifesto() {
  const words = TEXT.split(" ");
  return (
    <section className="px-6 py-48">
      <div className="mx-auto max-w-5xl">
        <p className="fig-label">Why it matters</p>
        <p
          data-words
          className="mt-14 font-display text-[clamp(1.75rem,4.5vw,4rem)] font-bold leading-[1.08] tracking-[-0.03em] text-paper"
        >
          {words.map((w, i) => (
            <span key={i} className="w-mask">
              <span
                className="w-word"
                style={{ transitionDelay: `${Math.min(i * 40, 900)}ms` }}
              >
                {w}
              </span>
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </p>
        <p className="dim-label mt-14">Fig 00 — The thesis</p>
      </div>
    </section>
  );
}
