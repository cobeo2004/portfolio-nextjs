"use client";

import { ArrowUpRight } from "@phosphor-icons/react";
import clsx from "clsx";
import { useLayoutEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { moreProjectsData, siteConfig } from "@/lib/data";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// More projects as a horizontal strip: on desktop the section pins and scrolling down moves
// the cards sideways, with a progress bar. Phones get a native swipe row with snap points,
// and desktop with reduced motion gets a plain grid.
export default function MoreProjects() {
  const pinnable = useMediaQuery(
    "(min-width: 961px) and (prefers-reduced-motion: no-preference)",
  );
  const secRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const progRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const sec = secRef.current;
    const track = trackRef.current;
    if (!pinnable || !sec || !track) return;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.5,
          refreshPriority: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progRef.current)
              progRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
    }, sec);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [pinnable]);

  return (
    <section
      ref={secRef}
      className={clsx("hstrip-sec", pinnable && "pinned")}
      aria-labelledby="more-projects"
    >
      <div className="wrap hstrip-head">
        <h2 id="more-projects" className="display h2" data-split>
          More <span className="hl">projects</span>
        </h2>
        {pinnable && (
          <span className="meta" aria-hidden="true">
            Keep scrolling, the row moves sideways
          </span>
        )}
      </div>
      <ol ref={trackRef} className="hstrip">
        {moreProjectsData.map((p, i) => (
          <li key={p.name}>
            <a
              className="hcard"
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener"
            >
              <span className="hcard-top">
                <span className="meta">{p.year}</span>
                <span className="meta">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(moreProjectsData.length).padStart(2, "0")}
                </span>
              </span>
              <strong className="display">{p.name}</strong>
              <span className="hcard-desc">{p.desc}</span>
              <span className="hcard-go">
                On GitHub <ArrowUpRight className="ico" aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
      </ol>
      {pinnable && (
        <div className="wrap" aria-hidden="true">
          <span className="hstrip-prog">
            <i ref={progRef} />
          </span>
        </div>
      )}
    </section>
  );
}
