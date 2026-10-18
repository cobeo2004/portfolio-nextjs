import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import StepsRail from "@/components/case-study/StepsRail";
import ContactBand from "@/components/contact/ContactBand";
import Crumbs from "@/components/layout/Crumbs";
import PageMotion from "@/components/motion/PageMotion";
import TransitionLink from "@/components/navigation/TransitionLink";
import CallViz from "@/components/widgets/CallViz";

export const metadata: Metadata = {
  title: "Syncnapse case study",
  description:
    "How Simon Nguyen built the addressing router and floor controller behind Syncnapse, Top 1 of 350+ teams.",
  alternates: { canonical: "/work/syncnapse" },
};

const facts = [
  { term: "Role", value: "Full-stack engineer, pitched to the judges" },
  {
    term: "Team",
    value: "We Maid AI, five engineers in Vietnam and Melbourne",
  },
  { term: "Time", value: "One week, July 2026" },
  { term: "Result", value: "Top 1 of 350+ teams" },
];

const myPart = [
  "Kept the API contract stable while four teammates rebuilt the layers beneath it.",
  "Split the monorepo into packages so five people shipped in parallel with zero merge disasters.",
  "Wrote the conventions down so nobody had to ask twice.",
  "Tuned the router and floor controller until the agent stopped talking over people.",
  "Pitched it to the judges. It won the track at Agentic AI Build Week 2026.",
];

export default function SyncnapsePage() {
  return (
    <main>
      <div className="cs-wrap">
        <section className="cs-hero">
          <div className="wrap">
            <Crumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Work", href: "/work" },
                { label: "Syncnapse" },
              ]}
            />
            <h1 className="display" data-split data-now>
              Sync<span className="hl">napse</span>
            </h1>
            <p className="lede mt-7 max-w-[52ch]">
              An AI teammate that joins your call, listens, speaks when it is
              addressed, and turns the meeting into company memory your
              organisation owns.
            </p>
            <dl className="cs-meta" data-rise>
              {facts.map((f) => (
                <div key={f.term}>
                  <dt>{f.term}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="cs-vis" data-reveal>
              <div className="blk left-0 bottom-0 w-[18%] h-[60%] bg-cobalt" />
              <div className="blk left-[18%] bottom-0 w-[10%] h-[30%] bg-ink" />
              <CallViz className="w-[min(640px,100%)]" />
            </div>
          </div>
        </section>
        <section className="manifesto">
          <div className="wrap">
            <p>
              Most meeting bots only take notes, and the ones that talk{" "}
              <span className="hl">interrupt.</span> We wanted a teammate that
              knows when to speak, and remembers only what a person approves.
            </p>
          </div>
        </section>
        <section>
          <div className="wrap">
            <h2 className="display h2" data-split>
              How it <span className="hl">works</span>
            </h2>
            <StepsRail />
          </div>
        </section>
        <section>
          <div className="wrap part">
            <h2 className="display h2" data-split>
              My <span className="hl">part</span>
            </h2>
            <ul>
              {myPart.map((line) => (
                <li key={line} data-row>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>
        <div className="wrap">
          <div className="next">
            <div>
              <span className="meta">Next</span>
              <div className="display">
                Trust<span className="hl">lane</span>
              </div>
            </div>
            <TransitionLink className="btn btn-primary" href="/work">
              Back to all work <ArrowRight className="ico" aria-hidden="true" />
            </TransitionLink>
          </div>
        </div>
      </div>
      <ContactBand />
      <PageMotion />
    </main>
  );
}
