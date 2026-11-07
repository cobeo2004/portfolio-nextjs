"use client";

import type React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSite } from "@/hooks/useSite";
import { gsap, prefersReducedMotion, SplitText } from "@/lib/gsap";

// The footer sits fixed underneath the page, and the end of every page lifts away to
// uncover it (after Dennis Snellenberg's portfolio). A spacer the footer's height keeps
// the scroll length right. It falls back to a normal footer when the footer is taller than
// the screen, and in wizard mode, where the fireflies need the page to stay see-through.
export default function Curtain({ children }: { children: React.ReactNode }) {
  const { wizard } = useSite();
  const spacerRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ footer: 0, screen: 0 });

  useEffect(() => {
    const footer = wrapRef.current?.firstElementChild;
    if (!footer) return;
    const measure = () =>
      setSize({
        footer: footer.getBoundingClientRect().height,
        screen: window.innerHeight,
      });
    const ro = new ResizeObserver(measure);
    ro.observe(footer);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const enabled = !wizard && size.footer > 0 && size.footer < size.screen * 0.9;

  useEffect(() => {
    document.documentElement.classList.toggle("curtain", enabled);
    return () => document.documentElement.classList.remove("curtain");
  }, [enabled]);

  // The footer drifts up into place and the big name rises letter by letter as it is uncovered.
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const footer = wrap?.querySelector("footer");
    if (!wrap || !footer || prefersReducedMotion()) return;
    const trigger = enabled ? spacerRef.current : footer;
    const ctx = gsap.context(() => {
      const name = wrap.querySelector<HTMLElement>(".big-name");
      if (name) {
        const split = SplitText.create(name, { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 110,
          ease: "none",
          stagger: 0.04,
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }
      if (enabled)
        gsap.fromTo(
          footer.querySelector(".wrap"),
          { yPercent: -18, opacity: 0.35 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
          },
        );
    }, wrap);
    return () => ctx.revert();
  }, [enabled]);

  return (
    <>
      <div
        ref={spacerRef}
        className="foot-spacer"
        style={{ height: enabled ? size.footer : 0 }}
        aria-hidden="true"
      />
      <div ref={wrapRef} className="foot-wrap">
        {children}
      </div>
    </>
  );
}
