"use client";

import { X } from "@phosphor-icons/react";
import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useSite } from "@/hooks/useSite";
import { prefersReducedMotion } from "@/lib/gsap";
import SceneBoundary from "./SceneBoundary";

const WizardScene = dynamic(() => import("./WizardScene"), { ssr: false });
const Sound = dynamic(() => import("@/components/Sounds/Sound"), {
  ssr: false,
});

type TFly = {
  x: number;
  y: number;
  r: number;
  a: number;
  s: number;
  p: number;
};

// Hidden mode (type "accio" or the Konami code): the night forest palette, fireflies,
// the 3D wizard and the anime music player. It stays on across pages until turned off.
export default function WizardMode() {
  const { wizard, setWizard, wizardNote, hideWizardNote } = useSite();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!wizardNote) return;
    const t = window.setTimeout(hideWizardNote, 9000);
    return () => window.clearTimeout(t);
  }, [wizardNote, hideWizardNote]);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (!wizard || !cv || !ctx) return;
    const reduce = prefersReducedMotion();
    const d = window.devicePixelRatio || 1;
    let flies: TFly[] = [];
    let frame = 0;
    const size = () => {
      cv.width = window.innerWidth * d;
      cv.height = window.innerHeight * d;
      flies = Array.from({ length: 48 }, () => ({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        r: (1 + Math.random() * 2) * d,
        a: Math.random() * 6.3,
        s: 0.2 + Math.random() * 0.4,
        p: Math.random() * 6.3,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      flies.forEach((q) => {
        if (!reduce) {
          q.a += (Math.random() - 0.5) * 0.2;
          q.x = (q.x + Math.cos(q.a) * q.s * d + cv.width) % cv.width;
          q.y = (q.y + Math.sin(q.a) * q.s * d + cv.height) % cv.height;
          q.p += 0.03;
        }
        const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.r * 7);
        const alpha = 0.45 + 0.4 * Math.sin(q.p);
        g.addColorStop(0, `rgba(242,179,61,${alpha})`);
        g.addColorStop(1, "rgba(242,179,61,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.r * 7, 0, 6.3);
        ctx.fill();
      });
      if (!reduce) frame = requestAnimationFrame(draw);
    };
    size();
    draw();
    window.addEventListener("resize", size);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", size);
      ctx.clearRect(0, 0, cv.width, cv.height);
    };
  }, [wizard]);

  return (
    <>
      <canvas id="flies" ref={canvasRef} aria-hidden="true" />
      {wizard && (
        <SceneBoundary>
          <WizardScene />
        </SceneBoundary>
      )}
      {wizard && <Sound />}
      <div className="wiz" hidden={!wizardNote} role="status">
        <button
          className="wiz-x"
          type="button"
          aria-label="Dismiss this note"
          onClick={hideWizardNote}
        >
          <X className="ico" aria-hidden="true" />
        </button>
        <div>
          <strong>Wizard mode is on.</strong> The night forest, the wizard and
          the music player are back, and they stay on as you move between pages.
          Close this note any time; type accio again to leave.
        </div>
        <div>
          <button
            className="btn btn-line h-11"
            type="button"
            onClick={() => setWizard(false)}
          >
            Leave wizard mode
          </button>
        </div>
      </div>
    </>
  );
}
