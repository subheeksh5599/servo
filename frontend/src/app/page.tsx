import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import ProblemSolution from "@/components/landing/ProblemSolution";
import Bento from "@/components/landing/Bento";
import Wallet from "@/components/landing/Wallet";
import HowItWorks from "@/components/landing/HowItWorks";
import ReceiptsList from "@/components/landing/ReceiptsList";
import Architecture from "@/components/landing/Architecture";
import FinalCta from "@/components/landing/FinalCta";
import Footer from "@/components/landing/Footer";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemSolution />
        <Bento />
        <Wallet />
        <HowItWorks />
        <ReceiptsList />
        <Architecture />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
