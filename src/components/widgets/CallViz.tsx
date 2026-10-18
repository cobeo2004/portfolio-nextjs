"use client";

import { Check, X } from "@phosphor-icons/react";
import clsx from "clsx";
import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

// A looping transcript: the addressing router ignores a remark between people, then the agent
// answers once it is asked directly and there is a pause.
export default function CallViz({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      const u = gsap.utils.toArray<HTMLElement>(".utt");
      const v = gsap.utils.toArray<HTMLElement>(".verdict");
      gsap
        .timeline({ repeat: -1, repeatDelay: 2.2 })
        .set(u, { autoAlpha: 0, y: 14 })
        .set(v, { autoAlpha: 0, scale: 0.9 })
        .to(u[0], { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" })
        .to(v[0], { autoAlpha: 1, scale: 1, duration: 0.3 }, "+=.6")
        .to(
          u[1],
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" },
          "+=.8",
        )
        .to(v[1], { autoAlpha: 1, scale: 1, duration: 0.3 }, "+=.6")
        .to(
          u[2],
          { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" },
          "+=1.1",
        )
        .to({}, { duration: 3 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className={clsx("call", className)}
      aria-label="Illustration: the addressing router ignores a remark between people, then answers when the agent is asked directly."
    >
      <div className="utt">
        <span className="av">NV</span>
        <div className="bub">
          <small>Nathan</small>Can we merge the router fix before Friday?
          <div>
            <span className="verdict">
              <X className="ico" aria-hidden="true" /> not for the agent
            </span>
          </div>
        </div>
      </div>
      <div className="utt">
        <span className="av">SN</span>
        <div className="bub">
          <small>Son</small>Syncnapse, what did we decide about memory last
          week?
          <div>
            <span className="verdict yes">
              <Check className="ico" aria-hidden="true" /> addressed, waiting
              for a pause
            </span>
          </div>
        </div>
      </div>
      <div className="utt">
        <span className="av bot">AI</span>
        <div className="bub">
          <small>Syncnapse</small>Memory stays proposed until someone approves
          it. I have two waiting for you.
        </div>
      </div>
    </div>
  );
}
