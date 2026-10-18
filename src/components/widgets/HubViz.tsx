"use client";

import { useEffect, useRef, useState } from "react";
import BrandIcon, { type TBrandIconName } from "@/components/icons/BrandIcon";
import { prefersReducedMotion } from "@/lib/gsap";

const sources: {
  name: TBrandIconName;
  title: string;
  left: string;
  top: string;
}[] = [
  { name: "meta", title: "Meta Ads", left: "12%", top: "14%" },
  { name: "googleads", title: "Google Ads", left: "50%", top: "6%" },
  {
    name: "googleanalytics",
    title: "Google Analytics 4",
    left: "88%",
    top: "14%",
  },
  {
    name: "googlesearchconsole",
    title: "Google Search Console",
    left: "12%",
    top: "86%",
  },
  { name: "googlecalendar", title: "Google Calendar", left: "50%", top: "94%" },
  { name: "clickup", title: "ClickUp", left: "88%", top: "86%" },
];

// Edge: marketing platforms feed one data layer, with data dots travelling along each line.
export default function HubViz() {
  const hubRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({
    w: 0,
    h: 0,
    paths: [] as string[],
    animate: false,
  });

  useEffect(() => {
    const hub = hubRef.current;
    if (!hub) return;
    const draw = () => {
      const r = hub.getBoundingClientRect();
      const cx = r.width / 2;
      const cy = r.height / 2;
      const paths = Array.from(hub.querySelectorAll<HTMLElement>(".logo")).map(
        (l) => {
          const b = l.getBoundingClientRect();
          const x = b.left - r.left + b.width / 2;
          const y = b.top - r.top + b.height / 2;
          const mx = (x + cx) / 2;
          return `M${x} ${y} C ${mx} ${y}, ${mx} ${cy}, ${cx} ${cy}`;
        },
      );
      setView({
        w: r.width,
        h: r.height,
        paths,
        animate: !prefersReducedMotion(),
      });
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(hub);
    document.fonts?.ready.then(draw);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="hub" ref={hubRef}>
      <svg
        className="lines"
        viewBox={`0 0 ${view.w || 1} ${view.h || 1}`}
        aria-hidden="true"
      >
        {view.paths.map((d, i) => (
          <g key={i}>
            <path className="ln" d={d} />
            {view.animate && (
              <circle className="dot" r="4">
                <animateMotion
                  dur={`${2 + i * 0.35}s`}
                  repeatCount="indefinite"
                  path={d}
                />
              </circle>
            )}
          </g>
        ))}
      </svg>
      {sources.map((s) => (
        <div
          key={s.name}
          className="logo"
          style={{ left: s.left, top: s.top }}
          title={s.title}
        >
          <BrandIcon name={s.name} />
        </div>
      ))}
      <div className="core">
        <b>One data layer</b>
        <span>then reporting agents</span>
      </div>
    </div>
  );
}
