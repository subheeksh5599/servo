"use client";

import { useEffect, useRef } from "react";

/**
 * Mosaic-tesserae hero art.
 *
 * A seeded tile grid: every tile is one of three shades of the paper/ink
 * palette, and a subset of tiles carries two hex characters sliced from real
 * Servo identifiers (the deployed registry, the attested demo payment, the
 * FDC voting round). Same seed, same art, on every render.
 *
 * The seed strings are honest data, not decoration: the registry that is live
 * on Coston2, the XRPL testnet payment whose proof verifies on-chain, and the
 * round that produced it.
 */
const HEX_SOURCES = [
  "3b40edd04b3275868b6362da1fc706d069379be6",
  "e715fa5510cb2795ce656276761b49017fee1a808934e07feeda958e8496d84d",
  "1594b0",
];

const PAPER = "#edf0ee";
const INK = "#0c2128";
const MID = "#b9c6c0";

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export default function MosaicCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let tiles: { x: number; y: number; s: number; shade: string; glyph: string | null }[] = [];

    const draw = (t: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        const rand = mulberry32(hashString("servo-coston2"));
        const cols = 30;
        const rows = 17;
        const cell = Math.min(w / cols, h / rows);
        const offsetX = (w - cell * cols) / 2;
        const offsetY = (h - cell * rows) / 2;
        const hexPool = HEX_SOURCES.join("").split("");
        tiles = [];
        for (let j = 0; j < rows; j++) {
          for (let i = 0; i < cols; i++) {
            const r = rand();
            const shade = r < 0.5 ? PAPER : r < 0.8 ? MID : INK;
            let glyph: string | null = null;
            if (r > 0.55 && r < 0.78) {
              const a = hexPool[Math.floor(rand() * hexPool.length)];
              const b = hexPool[Math.floor(rand() * hexPool.length)];
              glyph = a + b;
            }
            tiles.push({ x: offsetX + i * cell, y: offsetY + j * cell, s: cell, shade, glyph });
          }
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let k = 0; k < tiles.length; k++) {
        const tile = tiles[k];
        const shimmer = reduceMotion ? 0 : Math.sin(t * 0.9 + k * 0.35) * 0.05;
        const pad = Math.max(1, tile.s * 0.03);
        ctx.fillStyle = tile.shade;
        ctx.globalAlpha = 1 + shimmer;
        ctx.fillRect(tile.x + pad, tile.y + pad, tile.s - pad * 2, tile.s - pad * 2);
        if (tile.glyph) {
          ctx.globalAlpha = 1;
          ctx.fillStyle = tile.shade === PAPER ? "rgba(12,33,40,0.55)" : "rgba(237,240,238,0.72)";
          ctx.font = `${Math.max(8, tile.s * 0.16)}px ui-monospace, Menlo, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(tile.glyph, tile.x + tile.s / 2, tile.y + tile.s / 2);
        }
      }
      ctx.globalAlpha = 1;
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    const onResize = () => {
      if (reduceMotion) draw(0);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-label="A mosaic field of tiles, some inscribed with hexadecimal characters from the live Servo registry and the attested demo payment."
      className="h-full w-full"
    />
  );
}
