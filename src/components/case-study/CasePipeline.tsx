"use client";

import clsx from "clsx";
import { useLayoutEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { caseStudySteps } from "@/lib/data";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const STEP_VH = 70;

// "How it works" as a pinned pipeline you scrub with the scroll: a turn travels through the
// six stages, each stage lights up, the event log grows, and the copy on the right switches
// to the current step. Phones and reduced motion get the same steps as a plain list.
export default function CasePipeline() {
  const pinnable = useMediaQuery(
    "(min-width: 961px) and (prefers-reduced-motion: no-preference)",
  );
  const [active, setActive] = useState(0);
  const pinRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const packetRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const last = useRef(0);

  useLayoutEffect(() => {
    if (!pinnable || !pinRef.current) return;
    const steps = caseStudySteps.length;
    const st = ScrollTrigger.create({
      trigger: pinRef.current,
      start: "top top",
      end: `+=${steps * STEP_VH}%`,
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
        if (packetRef.current) packetRef.current.style.left = `${p * 100}%`;
        const i = Math.min(steps - 1, Math.floor(p * steps));
        if (i !== last.current) {
          last.current = i;
          setActive(i);
        }
      },
    });
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    return () => st.kill();
  }, [pinnable]);

  // The copy swaps with a short rise; it never fades while being read.
  useLayoutEffect(() => {
    if (!pinnable || !copyRef.current) return;
    gsap.fromTo(
      copyRef.current.children,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "expo.out", stagger: 0.05 },
    );
  }, [active, pinnable]);

  if (!pinnable)
    return (
      <div className="steps mt-12">
        {caseStudySteps.map((step, i) => (
          <div key={step.rail} className="step">
            <span className="meta">Step {i + 1}</span>
            <h3 className="display">{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    );

  const step = caseStudySteps[active];
  return (
    <div className="pipe" ref={pinRef}>
      <div className="pipe-vis" aria-hidden="true">
        <div className="pipe-rail">
          <span className="pipe-track">
            <span className="pipe-fill" ref={fillRef} />
          </span>
          <span className="pipe-packet" ref={packetRef} />
          <ol className="pipe-nodes">
            {caseStudySteps.map((s, i) => (
              <li
                key={s.rail}
                className={clsx(i < active && "done", i === active && "on")}
              >
                <i />
                <span>{s.rail}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="pipe-log">
          <div className="pipe-log-bar">
            <span />
            <span />
            <span />
            <em>syncnapse / live call</em>
          </div>
          {caseStudySteps.slice(0, active + 1).map((s) => (
            <p key={s.rail} className={clsx("pipe-line", s.log.tone)}>
              <b>{s.log.who}</b>
              {s.log.line}
            </p>
          ))}
        </div>
      </div>
      <div className="pipe-copy" ref={copyRef} aria-live="polite">
        <span className="meta">
          Step {String(active + 1).padStart(2, "0")} /{" "}
          {String(caseStudySteps.length).padStart(2, "0")}
        </span>
        <h3 className="display">{step.title}</h3>
        <p>{step.text}</p>
      </div>
      <ol className="sr">
        {caseStudySteps.map((s) => (
          <li key={s.rail}>
            {s.title}: {s.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
