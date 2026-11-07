"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { moreProjectsData, siteConfig } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/gsap";

// More projects as a sideways row you scroll yourself: swipe left or right on a trackpad,
// hold Shift and use the mouse wheel, drag on touch, or use the arrow buttons. Plain vertical
// scrolling over the row keeps scrolling the page.
export default function MoreProjects() {
  const trackRef = useRef<HTMLOListElement>(null);
  const progRef = useRef<HTMLElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const sync = () => {
      const max = track.scrollWidth - track.clientWidth;
      const p = max > 0 ? track.scrollLeft / max : 0;
      if (progRef.current) progRef.current.style.transform = `scaleX(${p})`;
      setEdges({
        start: track.scrollLeft <= 2,
        end: track.scrollLeft >= max - 2,
      });
    };

    // Shift + wheel and sideways trackpad swipes scroll the row. Handling them here also
    // stops the page's smooth scroll from turning them into vertical movement.
    const onWheel = (e: WheelEvent) => {
      const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!e.shiftKey && !sideways) return;
      const delta = sideways ? e.deltaX : e.deltaY;
      e.preventDefault();
      e.stopPropagation();
      const notch = e.deltaMode !== 0 || Math.abs(delta) >= 50;
      track.scrollBy({
        left: e.deltaMode === 1 ? delta * 40 : delta,
        behavior: notch && !prefersReducedMotion() ? "smooth" : "auto",
      });
    };

    sync();
    track.addEventListener("scroll", sync, { passive: true });
    track.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", sync);
    return () => {
      track.removeEventListener("scroll", sync);
      track.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !card) return;
    track.scrollBy({
      left: dir * (card.getBoundingClientRect().width + 20),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <section className="hstrip-sec" aria-labelledby="more-projects">
      <div className="wrap hstrip-head">
        <h2 id="more-projects" className="display h2" data-split>
          More <span className="hl">projects</span>
        </h2>
        <div className="hstrip-ctl">
          <span className="meta">Shift + scroll, swipe, or use the arrows</span>
          <button
            className="sq"
            type="button"
            aria-label="Previous projects"
            aria-controls="more-projects-row"
            disabled={edges.start}
            onClick={() => step(-1)}
          >
            <ArrowLeft className="ico" aria-hidden="true" />
          </button>
          <button
            className="sq"
            type="button"
            aria-label="More projects"
            aria-controls="more-projects-row"
            disabled={edges.end}
            onClick={() => step(1)}
          >
            <ArrowRight className="ico" aria-hidden="true" />
          </button>
        </div>
      </div>
      <ol
        id="more-projects-row"
        ref={trackRef}
        className="hstrip"
        data-start={edges.start || undefined}
        data-end={edges.end || undefined}
      >
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
      <div className="wrap" aria-hidden="true">
        <span className="hstrip-prog">
          <i ref={progRef} />
        </span>
      </div>
    </section>
  );
}
