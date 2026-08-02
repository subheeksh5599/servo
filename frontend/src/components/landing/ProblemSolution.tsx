import { X, Check } from "lucide-react";

const OLD = [
  "Your XRP sits in a wallet earning nothing",
  "Yield is spread across 8+ pools — nobody watches it for you",
  "DCA means manual buys on a schedule you keep yourself",
  "Every move needs a signature, a bridge, and your attention",
];

const NEW = [
  "One XRPL payment sets the order — the machine does the rest",
  "FDC proves your payment on-chain; FAssets mints it into FXRP",
  "A strategy agent re-routes to the best realized yield automatically",
  "Every execution leaves a verifiable on-chain receipt",
];

export default function ProblemSolution() {
  return (
    <section id="problem" className="flex flex-col md:flex-row">
      {/* THE OLD WAY */}
      <div className="flex flex-col items-start gap-8 bg-charcoal px-8 py-20 text-paper md:w-1/2 md:px-16">
        <p className="font-body text-xs uppercase tracking-widest text-sage/60">
          The old way
        </p>
        <h2 className="display text-5xl text-paper md:text-6xl">
          Money that
          <br />
          sleeps.
        </h2>
        <ul className="mt-4 space-y-6">
          {OLD.map((item) => (
            <li key={item} className="flex items-start gap-4">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                <X className="h-4 w-4 text-red-400" />
              </span>
              <p className="max-w-md font-body text-lg leading-relaxed text-sage">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* THE SERVO WAY */}
      <div className="flex flex-col items-start gap-8 border-t-4 border-butter bg-coal px-8 py-20 text-paper md:w-1/2 md:border-t-0 md:border-l-4 md:px-16">
        <p className="font-body text-xs uppercase tracking-widest text-butter">
          The servo way
        </p>
        <h2 className="display text-5xl text-paper md:text-6xl">
          Money that
          <br />
          <span className="text-butter">works.</span>
        </h2>
        <ul className="mt-4 space-y-6">
          {NEW.map((item) => (
            <li key={item} className="flex items-start gap-4">
              <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-butter">
                <Check className="h-4 w-4 text-charcoal" />
              </span>
              <p className="max-w-md font-body text-lg leading-relaxed text-paper">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
