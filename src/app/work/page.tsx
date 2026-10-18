import type { Metadata } from "next";
import ContactBand from "@/components/contact/ContactBand";
import PageHead from "@/components/layout/PageHead";
import PageMotion from "@/components/motion/PageMotion";
import Collective from "@/components/work/Collective";
import GithubFeed from "@/components/work/GithubFeed";
import MoreProjects from "@/components/work/MoreProjects";
import WorkGrid from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Twelve projects by Simon Nguyen: AI systems, backend services and product design.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <main>
      <PageHead
        crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        title="Wo"
        hl="rk"
      >
        <p className="lede" data-rise>
          Twelve things I&apos;ve built, led or designed. Filter by what
          you&apos;re hiring for.
        </p>
      </PageHead>
      <WorkGrid />
      <Collective />
      <MoreProjects />
      <GithubFeed />
      <ContactBand />
      <PageMotion />
    </main>
  );
}
