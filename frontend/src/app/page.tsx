import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Mechanism from "@/components/Mechanism";
import PhotoBreak from "@/components/PhotoBreak";
import Manifesto from "@/components/Manifesto";
import Protocols from "@/components/Protocols";
import Roadmap from "@/components/Roadmap";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Mechanism />
        <PhotoBreak src="/coin.png" caption="The asset — now in motion" />
        <Manifesto />
        <PhotoBreak
          src="/network.png"
          caption="The machine — every node verified"
          align="right"
        />
        <Protocols />
        <Roadmap />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
