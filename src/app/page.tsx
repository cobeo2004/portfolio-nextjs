import ContactBand from "@/components/contact/ContactBand";
import Facts from "@/components/home/Facts";
import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import Marquee from "@/components/home/Marquee";
import Teaser from "@/components/home/Teaser";
import WorkStack from "@/components/home/WorkStack";
import PageMotion from "@/components/motion/PageMotion";
import Collective from "@/components/work/Collective";

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Facts />
      <Manifesto />
      <WorkStack />
      <Collective />
      <Teaser />
      <ContactBand />
      <PageMotion />
    </main>
  );
}
