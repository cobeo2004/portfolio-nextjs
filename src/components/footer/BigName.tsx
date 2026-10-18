"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion, SplitText } from "@/lib/gsap";

// The oversized name at the foot of every page; its letters rise as the footer scrolls in.
export default function BigName() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(ref.current!, { type: "chars" });
      gsap.from(split.chars, {
        yPercent: 110,
        ease: "none",
        stagger: 0.04,
        scrollTrigger: {
          trigger: "footer",
          start: "top bottom",
          end: "bottom bottom",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="display big-name" aria-hidden="true">
      Simon Nguyen
    </div>
  );
}
