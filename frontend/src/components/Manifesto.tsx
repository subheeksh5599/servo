const TEXT =
  "Every week your XRP sits still, it loses ground it could be earning. Servo makes it move — mint, route, receive, repeat. One signature at setup. One when the agent asks. An on-chain receipt for everything in between.";

export default function Manifesto() {
  const words = TEXT.split(" ");
  return (
    <section className="relative overflow-hidden px-6 py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,hsl(248_75%_64%_/_0.09),transparent_55%)]"
      />
      <div className="relative mx-auto max-w-4xl">
        <p className="sec-label reveal">Why it matters</p>
        <p
          data-words
          className="mt-10 font-display text-[clamp(1.75rem,4.5vw,3.75rem)] font-semibold leading-[1.1] tracking-[-0.02em]"
        >
          {words.map((w, i) => (
            <span key={i} className="w-mask">
              <span
                className="w-word"
                style={{ transitionDelay: `${Math.min(i * 35, 800)}ms` }}
              >
                {w}
              </span>
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
