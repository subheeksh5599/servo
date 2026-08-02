"use client";

import { useEffect, useState } from "react";

const RPC =
  process.env.NEXT_PUBLIC_FLARE_RPC ||
  "https://flare-api.flare.network/ext/C/rpc";
const FTSOV2 =
  process.env.NEXT_PUBLIC_FLARE_FTSOV2 ||
  "0x7bde3df0624114edb3a67dfe6753e62f4e7c1d20";
const DATA =
  "0x93e9f806" +
  "015852502f55534400000000000000000000000000" +
  "0000000000000000000000";

export default function useXrpPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/xrp", { cache: "no-store" });
        const json = await res.json();
        if (mounted && json?.ok) {
          setPrice(json.price);
          setLive(true);
        } else if (mounted) {
          setLive(false);
        }
      } catch {
        if (mounted) setLive(false);
      }
    };
    fetchPrice();
    const iv = window.setInterval(fetchPrice, 20000);
    return () => {
      mounted = false;
      window.clearInterval(iv);
    };
  }, []);

  return { price, live };
}
