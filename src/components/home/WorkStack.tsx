import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type React from "react";
import TransitionLink from "@/components/navigation/TransitionLink";
import CallViz from "@/components/widgets/CallViz";
import Coalescer from "@/components/widgets/Coalescer";
import DocViz from "@/components/widgets/DocViz";
import HubViz from "@/components/widgets/HubViz";
import { stackPanels } from "@/lib/data";

// Colour blocks behind each visual, in the Lead the Way stair style.
const Block = ({ className }: { className: string }) => (
  <div className={`blk ${className}`} />
);

const visuals: Record<string, React.ReactNode> = {
  syncnapse: (
    <>
      <Block className="right-0 top-0 w-[28%] h-[38%] bg-cobalt-soft" />
      <CallViz />
      <span className="cap">
        Illustration of the addressing router and floor controller
      </span>
    </>
  ),
  trustlane: (
    <>
      <Block className="left-0 bottom-0 w-[40%] h-[46%] bg-ink" />
      <Block className="left-[40%] bottom-0 w-[18%] h-[22%] bg-cobalt" />
      <div className="shot tilt">
        <Image
          src="/img/trustlane.webp"
          alt="TrustLane landing page and claims dashboard"
          width={1280}
          height={740}
          sizes="(max-width: 960px) 100vw, 50vw"
        />
      </div>
    </>
  ),
  "document-ai": (
    <>
      <DocViz />
      <span className="cap">
        Illustration of the fill-and-cite flow. Client files stay on their
        network.
      </span>
    </>
  ),
  edge: (
    <>
      <HubViz />
      <span className="cap">Plus Klaviyo, ActiveCampaign and Harvest</span>
    </>
  ),
  rsdecider: <Coalescer />,
  "zero-to-hero": (
    <>
      <Block className="right-0 top-0 w-[22%] h-full bg-cobalt" />
      <Block className="right-[22%] top-0 w-[16%] h-[62%] bg-ink" />
      <div className="shot tilt">
        <Image
          src="/img/zth.webp"
          alt="From Zero to Hero landing page with app screens for the manager and crew tracks"
          width={1280}
          height={800}
          sizes="(max-width: 960px) 100vw, 50vw"
        />
      </div>
    </>
  ),
};

// Selected work as a sticky stack: each panel pins, then shrinks back as the next arrives.
export default function WorkStack() {
  return (
    <section id="work">
      <div className="wrap">
        <div className="work-intro">
          <h2 className="display h2" data-split>
            Selected <span className="hl">work</span>
          </h2>
          <div className="grid justify-items-start gap-[18px]">
            <p className="lede max-w-[36ch]">
              Six systems I built or led, with the numbers that came out of
              them.
            </p>
            <TransitionLink className="btn btn-line" href="/work">
              All twelve projects{" "}
              <ArrowRight className="ico" aria-hidden="true" />
            </TransitionLink>
          </div>
        </div>
        <div className="stack" data-stack>
          {stackPanels.map((panel) => (
            <article key={panel.slug} className="panel">
              <div className="p-text">
                <span className="meta">{panel.meta}</span>
                <h3 className="display">
                  {panel.title}
                  <span className="hl">{panel.hl}</span>
                  {panel.after}
                </h3>
                <p>{panel.desc}</p>
                <div className="tags">
                  {panel.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="p-nums">
                  {panel.nums.map((n) => (
                    <div key={n.big}>
                      <b>{n.big}</b>
                      <span>{n.small}</span>
                    </div>
                  ))}
                </div>
                {panel.cta && (
                  <div className="p-cta">
                    {panel.cta.external ? (
                      <a
                        className="btn btn-line"
                        href={panel.cta.href}
                        target="_blank"
                        rel="noopener"
                      >
                        {panel.cta.label}{" "}
                        <ArrowUpRight className="ico" aria-hidden="true" />
                      </a>
                    ) : (
                      <TransitionLink
                        className="btn btn-primary"
                        href={panel.cta.href}
                      >
                        {panel.cta.label}{" "}
                        <ArrowRight className="ico" aria-hidden="true" />
                      </TransitionLink>
                    )}
                  </div>
                )}
              </div>
              <div className="p-vis">{visuals[panel.slug]}</div>
              <span className="dim" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
