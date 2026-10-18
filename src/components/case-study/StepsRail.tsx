"use client";

import clsx from "clsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { caseStudySteps } from "@/lib/data";
import { prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

// "How it works": a sticky rail fills as you read, and highlights the step in view.
export default function StepsRail() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [current, setCurrent] = useState(0);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !stepsRef.current) return;
    const st = ScrollTrigger.create({
      trigger: stepsRef.current,
      start: "top 60%",
      end: "bottom 60%",
      onUpdate: (s) => {
        if (fillRef.current)
          fillRef.current.style.transform = `scaleY(${s.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    const steps = Array.from(stepsRef.current?.querySelectorAll(".step") ?? []);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(steps.indexOf(e.target));
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    steps.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <div className="how">
      <div className="rail">
        <div className="track">
          <span className="fill" ref={fillRef} />
        </div>
        <ol>
          {caseStudySteps.map((step, i) => (
            <li key={step.rail} className={clsx(i === current && "on")}>
              {step.rail}
            </li>
          ))}
        </ol>
      </div>
      <div className="steps" ref={stepsRef}>
        {caseStudySteps.map((step, i) => (
          <div key={step.rail} className="step">
            <span className="meta">Step {i + 1}</span>
            <h3 className="display">{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
