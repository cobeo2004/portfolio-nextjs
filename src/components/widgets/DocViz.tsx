"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const fields = [
  { label: "Design criteria", width: "88%", ref: "spec.pdf p.12" },
  { label: "Scope of works", width: "76%", ref: "scope.docx §3" },
  { label: "Load schedule", width: "92%", ref: "loads.xlsx B4:F40" },
  { label: "Assumptions", width: "64%", ref: "spec.pdf p.30" },
];

// Fill-and-cite: sources fill an outcome document, each field citing where it came from.
export default function DocViz() {
  const ref = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    const ctx = gsap.context(() => {
      const pct = { v: 0 };
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(
          ".fld:not(.gap) .v",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power3.out", stagger: 0.25 },
        )
        .to(
          pct,
          {
            v: 90,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              if (pctRef.current)
                pctRef.current.textContent = `${Math.round(pct.v)}%`;
            },
          },
          0,
        );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="docs"
      aria-label="Illustration: PDF, DOCX and XLSX sources fill an outcome document, each field citing its source, one field left for a person."
    >
      <div className="srcs">
        <div className="src">
          <b>PDF</b>
          <span>spec.pdf</span>
        </div>
        <div className="src">
          <b>DOCX</b>
          <span>scope.docx</span>
        </div>
        <div className="src">
          <b>XLSX</b>
          <span>loads.xlsx</span>
        </div>
      </div>
      <div className="out">
        <h4>Technical outcome report</h4>
        {fields.map((f) => (
          <div key={f.label} className="fld">
            <div>
              <span>{f.label}</span>
              <div className="v" style={{ width: f.width }} />
            </div>
            <span className="ref">{f.ref}</span>
          </div>
        ))}
        <div className="fld gap">
          <div>
            <span>Sign-off notes</span>
            <div className="v w-full" />
          </div>
          <span className="ref">needs a person</span>
        </div>
        <div className="tot">
          <span>autofill</span>
          <span ref={pctRef}>90%</span>
        </div>
      </div>
    </div>
  );
}
