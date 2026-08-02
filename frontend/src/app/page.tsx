import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import KineticHero from "@/components/KineticHero";
import MachineMarquee from "@/components/MachineMarquee";
import Blueprint from "@/components/Blueprint";
import Manifesto from "@/components/Manifesto";
import WhyFlare from "@/components/WhyFlare";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <KineticHero />
        <MachineMarquee />
        <Blueprint />
        <Manifesto />
        <WhyFlare />
        <Roadmap />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
