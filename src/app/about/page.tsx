import type { Metadata } from "next";
import AboutLayout from "@/components/about/AboutLayout";
import Awards from "@/components/about/Awards";
import Experience from "@/components/about/Experience";
import SkillBeam from "@/components/about/SkillBeam";
import ContactBand from "@/components/contact/ContactBand";
import PageHead from "@/components/layout/PageHead";
import PageMotion from "@/components/motion/PageMotion";
import { capabilitiesData } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description: "Experience, awards and the tools Simon Nguyen reaches for.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main>
      <PageHead
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title="Ab"
        hl="out"
      >
        <p className="lede max-w-[52ch]" data-rise>
          I&apos;m Simon, an AI product and full-stack engineer. I studied
          computer science at Swinburne and spend my days putting AI where it
          has to be right.
        </p>
      </PageHead>
      <AboutLayout>
        <section id="overview" className="about-overview">
          <div className="about-copy" data-rise>
            <p>
              The backend is where I&apos;m happiest: queues, caches, contracts
              between services, and keeping latency flat when a machine is full.
            </p>
            <p>
              I also like being in the room with the people who will use what I
              build, from requirements through to the on-prem rollout. I speak
              Vietnamese and English, and I&apos;ve pitched to judges at two
              national competitions.
            </p>
          </div>
          <div className="caps">
            {capabilitiesData.map((cap) => (
              <div key={cap.title} data-row>
                <h3>{cap.title}</h3>
                <p>{cap.text}</p>
              </div>
            ))}
          </div>
        </section>
        <Experience />
        <Awards />
        <SkillBeam />
      </AboutLayout>
      <ContactBand />
      <PageMotion />
    </main>
  );
}
