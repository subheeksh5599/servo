import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Pipeline from "@/components/Pipeline";
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
        <Pipeline />
        <Manifesto />
        <Protocols />
        <Roadmap />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
