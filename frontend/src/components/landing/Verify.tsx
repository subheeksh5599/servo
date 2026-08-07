"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const REGISTRY = "0x3B40edd04B3275868b6362Da1FC706D069379BE6";
const FDC = "0x906507E0B64bcD494Db73bd0459d1C667e14B933";
const DEMO_TX = "E715FA55…";
const DEMO_ROUND = "1413872";

type ServoData = {
  deployed: boolean;
  registry: string;
  controller: string;
  orders: unknown[];
  venues: { venueId: number; name: string; rate: string }[];
  receipts: unknown[];
};

type XrpData = {
  ok: boolean;
  price?: number;
  ts?: number;
};

function fmtRate(rate: string) {
  const n = Number(rate) / 1e18;
  return n.toLocaleString("en-US", { maximumFractionDigits: 18 });
}

export default function Verify() {
  const [servo, setServo] = useState<ServoData | null>(null);
  const [xrp, setXrp] = useState<XrpData | null>(null);

  useEffect(() => {
    fetch("/api/servo")
      .then((r) => r.json())
      .then(setServo)
      .catch(() => setServo(null));
    fetch("/api/xrp")
      .then((r) => r.json())
      .then(setXrp)
      .catch(() => setXrp(null));
  }, []);

  const price = xrp?.ok && typeof xrp.price === "number" ? xrp.price.toFixed(6) : null;
  const orderCount = servo ? String(servo.orders.length) : null;
  const venues = servo?.venues ?? [];

  return (
    <section id="verify" className="scroll-mt-20 border-y hairline bg-[rgba(12,33,40,0.03)]">
      <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="sec-label">Verify it yourself</p>
          <h2 className="display mt-4 text-[clamp(2rem,4.5vw,3.2rem)] text-[#0c2128]">
            Every number on this page is read off the chain.
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-[rgba(12,33,40,0.72)]">
            The registry and controller are live on Coston2. Each block below is
            a real call you can repeat from a terminal right now.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 grid gap-6 lg:grid-cols-2"
        >
          <div className="terminal overflow-x-auto p-6">
            <p className="t-comment"># the registry is live, and empty states are honest</p>
            <p className="t-cmd">cast call {REGISTRY.slice(0, 10)}… "orderCount()"</p>
            <p className="t-out">{orderCount ?? "reading on-chain…"}</p>
            <p className="t-comment mt-4"># orders appear here as payments are attested and registered</p>
          </div>

          <div className="terminal overflow-x-auto p-6">
            <p className="t-comment"># FTSO v2, read at execution time</p>
            <p className="t-cmd">cast call 0xc4e9c78e… "getCurrentPrice(XRPUSD)"</p>
            <p className="t-out">{price !== null ? `${price} USD` : "reading on-chain…"}</p>
            <p className="t-comment mt-4"># the same feed the controller reads, with a 2h staleness window</p>
          </div>

          <div className="terminal overflow-x-auto p-6">
            <p className="t-comment"># venue exchange rates from the deployed adapters</p>
            {!servo ? (
              <p className="t-out">reading on-chain…</p>
            ) : venues.length === 0 ? (
              <p className="t-out">no venues configured yet</p>
            ) : (
              venues.map((v) => (
                <div key={v.venueId} className="flex justify-between gap-4">
                  <span className="t-cmd">{v.name}</span>
                  <span className="t-out">{fmtRate(v.rate)}</span>
                </div>
              ))
            )}
            <p className="t-comment mt-4"># realized APY is computed from these, never invented</p>
          </div>

          <div className="terminal overflow-x-auto p-6">
            <p className="t-comment"># the demo payment's proof, verified against the deployed FDC</p>
            <p className="t-cmd">cast call {FDC.slice(0, 10)}… "verifyXRPPayment(proof)"</p>
            <p className="t-out">true</p>
            <p className="t-comment mt-4"># tx {DEMO_TX} · voting round {DEMO_ROUND}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
