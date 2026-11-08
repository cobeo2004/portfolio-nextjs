"use client";

import { FileText, Sparkle } from "@phosphor-icons/react";
import clsx from "clsx";
import type React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { siteConfig } from "@/lib/data";
import { ScrollTrigger } from "@/lib/gsap";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "experience", label: "Experience" },
  { id: "awards", label: "Wins and school" },
  { id: "skills", label: "What I reach for" },
];

// About page frame after Brittany Chiang's portfolio: a pinned column with who I am, the CV
// and an index whose lines grow and fill as you read each section, plus a soft spotlight
// that follows the cursor. Below 1100px it becomes a normal single column.
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(sections[0].id);
  const spotRef = useRef<HTMLDivElement>(null);
  const items = useRef<Record<string, HTMLAnchorElement | null>>({});
  const spotlight = useMediaQuery(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  );

  useLayoutEffect(() => {
    const triggers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setActive(id),
        onUpdate: (self) =>
          items.current[id]?.style.setProperty("--p", self.progress.toFixed(3)),
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  useEffect(() => {
    const el = spotRef.current;
    if (!spotlight || !el) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
        el.style.setProperty("--so", "1");
      });
    };
    const onLeave = () => el.style.setProperty("--so", "0");
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [spotlight]);

  return (
    <div className="about-spot" ref={spotRef}>
      <div className="wrap about-layout">
        <aside className="about-aside" data-rise>
          <div className="about-id">
            <b>{siteConfig.name}</b>
            <span>
              {siteConfig.role}, {siteConfig.city}
            </span>
            <span className="about-status">
              <i aria-hidden="true" /> Open to full-time roles
            </span>
          </div>
          <nav className="ix" aria-label="On this page">
            {sections.map((s, i) => (
              <a
                key={s.id}
                ref={(el) => {
                  items.current[s.id] = el;
                }}
                href={`#${s.id}`}
                className={clsx(active === s.id && "on")}
                aria-current={active === s.id ? "location" : undefined}
              >
                <span className="ix-n">{String(i + 1).padStart(2, "0")}</span>
                <span className="ix-line" aria-hidden="true" />
                {s.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap gap-3">
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
        </aside>
        <div className="about-main">{children}</div>
      </div>
    </div>
  );
}
