import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Blueprint from "@/components/Blueprint";
import WhyFlare from "@/components/WhyFlare";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Blueprint />
        <WhyFlare />
        <Roadmap />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
