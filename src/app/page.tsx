import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { CapabilityStrip } from "@/components/sections/CapabilityStrip";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { Introduction } from "@/components/sections/Introduction";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { SystemArchitecture } from "@/components/sections/SystemArchitecture";
import { WhyAtlas } from "@/components/sections/WhyAtlas";
import { Floating3DBackground } from "@/components/ui/Floating3DBackground";
import { BackToTop } from "@/components/ui/BackToTop";

export default function HomePage() {
  return (
    <>
      <Floating3DBackground />
      <Navbar />
      <main className="relative z-1">
        <Hero />
        <CapabilityStrip />
        <Introduction />
        <Services />
        <SystemArchitecture />
        <Process />
        <WhyAtlas />
        <FinalCTA />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
