"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Kinetic word reveals: when a word enters, reveal with stagger
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const parent = entry.target.closest("[data-words]");
            const words = parent
              ? parent.querySelectorAll(".w-word")
              : [entry.target];
            words.forEach((w) => w.classList.add("is-visible"));
            if (parent) observer.unobserve(parent);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("[data-words]").forEach((el) =>
      observer.observe(el)
    );

    const t = window.setTimeout(() => ScrollTrigger.refresh(), 700);

    return () => {
      window.clearTimeout(t);
      observer.disconnect();
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return <div className="bg-ink text-paper">{children}</div>;
}
