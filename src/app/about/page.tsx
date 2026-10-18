import { FileText, Sparkle } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import Awards from "@/components/about/Awards";
import Experience from "@/components/about/Experience";
import SkillBeam from "@/components/about/SkillBeam";
import ContactBand from "@/components/contact/ContactBand";
import PageHead from "@/components/layout/PageHead";
import PageMotion from "@/components/motion/PageMotion";
import { capabilitiesData, siteConfig } from "@/lib/data";

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
          I&apos;m Simon, a forward deployed and full-stack engineer. I studied
          computer science at Swinburne and spend my days putting AI where it
          has to be right.
        </p>
      </PageHead>
      <section className="pb-24">
        <div className="wrap about">
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
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                className="btn btn-primary"
                href={siteConfig.links.cv}
                target="_blank"
                rel="noopener"
              >
                <FileText className="ico" aria-hidden="true" /> Read my CV
              </a>
              <button className="btn btn-line" type="button" data-cmdk>
                <Sparkle className="ico" aria-hidden="true" /> Ask my CV
              </button>
            </div>
          </div>
          <div className="caps">
            {capabilitiesData.map((cap) => (
              <div key={cap.title} data-row>
                <h3>{cap.title}</h3>
                <p>{cap.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Experience />
      <Awards />
      <SkillBeam />
      <ContactBand />
      <PageMotion />
    </main>
  );
}
