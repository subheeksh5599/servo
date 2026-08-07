import { DisclosureSection } from "@/components/landing/disclosure-section";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { HeadlineBand } from "@/components/landing/headline-band";
import { LeakSection } from "@/components/landing/leak-section";
import { MosaicFold } from "@/components/landing/mosaic-fold";
import { PathSection } from "@/components/landing/path-section";
import { SkipToContent } from "@/components/landing/skip-to-content";
import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { TechStrip } from "@/components/landing/tech-strip";
import { VerifySection } from "@/components/landing/verify-section";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Servo — sign once, your XRP works forever",
});

/**
 * Section order is composed from the brief, not assembled from blocks: the
 * artwork states the idea, the headline names it, the leak shows why it
 * matters, the disclosure is honest about the boundary, the path explains the
 * mechanism, and the verification proves all of it.
 */
export default function HomePage(): ReactNode {
  return (
    <SmoothScroll>
      <SkipToContent />
      <Header />
      <main id="main-content" className="flex-1">
        <MosaicFold />
        <HeadlineBand />
        <TechStrip />
        <LeakSection />
        <DisclosureSection />
        <PathSection />
        <VerifySection />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
