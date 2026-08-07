"use client";

import { motion } from "framer-motion";

function Row({ term, def, note }: { term: string; def: string; note: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b hairline py-3.5">
      <div>
        <div className="font-mono text-[13px] text-[rgba(12,33,40,0.55)]">{term}</div>
        <div className="mt-0.5 text-[13px] italic text-[rgba(12,33,40,0.5)]">{note}</div>
      </div>
      <div className="text-right font-mono text-[14px] text-[#0c2128]">{def}</div>
    </div>
  );
}

export default function TheLeak() {
  return (
    <section id="leak" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="sec-label">The leak</p>
        <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.2rem)] text-[#0c2128]">
          Public rails publish an operational diary.
        </h2>
        <p className="mt-6 text-[17px] leading-relaxed text-[rgba(12,33,40,0.72)]">
          Recurring payments on a public ledger are a readable strategy. Every
          transfer records who is paying, how much, how often, and to whom, and
          it stays linkable forever. For a salary, a subscription, or a
          dollar-cost averaging plan, that is a schedule handed to anyone who
          cares to read it.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-[16px] font-medium">A recurring payment in the open</p>
          <div className="border-t hairline">
            <Row term="from" def="rN7n…8m2k" note="who is paying, every time" />
            <Row term="to" def="r9dR…4b1f" note="and to whom" />
            <Row term="amount" def="25 XRP" note="what it cost, every time" />
            <Row term="cadence" def="every 7 days" note="visible forever" />
            <Row term="strategy" def="readable" note="the plan behind the payments" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 text-[16px] font-medium">The same plan through Servo</p>
          <div className="border-t hairline">
            <Row term="event" def="one payment" note="with a Servo memo, then done" />
            <Row term="order" def="registered" note="an FDC proof, not a schedule" />
            <Row term="amount" def="at execution" note="only when the tick fires" />
            <Row term="cadence" def="on-chain" note="gated by the controller" />
            <Row term="strategy" def="off-chain" note="the agent proposes, never decides alone" />
          </div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7 }}
        className="mx-auto mt-14 max-w-3xl text-center text-[17px] leading-relaxed text-[rgba(12,33,40,0.72)]"
      >
        The naive fix, don't automate on-chain, is worse. Then the plan is a
        manual chore, and the strategy dies with the person who remembered to
        run it. Servo turns one signed payment into a standing order, enforced
        by a controller with caps and a circuit breaker, not by a calendar
        reminder.
      </motion.p>
    </section>
  );
}
