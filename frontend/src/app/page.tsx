import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import TheLeak from "@/components/landing/TheLeak";
import WhatsHidden from "@/components/landing/WhatsHidden";
import HowItMoves from "@/components/landing/HowItMoves";
import Verify from "@/components/landing/Verify";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="light">
      <Nav />
      <main>
        <Hero />
        <TheLeak />
        <WhatsHidden />
        <HowItMoves />
        <Verify />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
