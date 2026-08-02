import ConsoleNav from "@/components/ConsoleNav";
import MachineHero from "@/components/MachineHero";
import AuditFeed from "@/components/AuditFeed";
import FigSections from "@/components/FigSections";
import WhyFlare from "@/components/WhyFlare";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <ConsoleNav />
      <main>
        <MachineHero />
        <AuditFeed />
        <FigSections />
        <WhyFlare />
        <Roadmap />
      </main>
      <Footer />
    </>
  );
}
