"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { skillsData, skillTargets } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/gsap";

type TBeamPath = { skill: number; d: string };

// Skills on the left beam into the projects that use them; it cycles until you hover a skill.
export default function SkillBeam() {
  const beamRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [cycling, setCycling] = useState(true);
  const [view, setView] = useState({
    w: 0,
    h: 0,
    paths: [] as TBeamPath[],
    animate: false,
  });

  useEffect(() => {
    const beam = beamRef.current;
    if (!beam) return;
    const draw = () => {
      const r = beam.getBoundingClientRect();
      const paths: TBeamPath[] = [];
      beam.querySelectorAll<HTMLElement>(".bcol.l .bk").forEach((s, i) => {
        const a = s.getBoundingClientRect();
        const x1 = a.right - r.left;
        const y1 = a.top - r.top + a.height / 2;
        skillsData[i].to.forEach((id) => {
          const p = beam.querySelector<HTMLElement>(
            `.bcol.r [data-id="${id}"]`,
          );
          if (!p) return;
          const b = p.getBoundingClientRect();
          const x2 = b.left - r.left;
          const y2 = b.top - r.top + b.height / 2;
          const mx = (x1 + x2) / 2;
          paths.push({
            skill: i,
            d: `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`,
          });
        });
      });
      setView({
        w: r.width,
        h: r.height,
        paths,
        animate: !prefersReducedMotion(),
      });
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(beam);
    document.fonts?.ready.then(draw);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!cycling || prefersReducedMotion()) return;
    const t = window.setInterval(
      () => setActive((a) => (a + 1) % skillsData.length),
      2600,
    );
    return () => window.clearInterval(t);
  }, [cycling]);

  const pick = (i: number) => {
    setCycling(false);
    setActive(i);
  };
  const targets = skillsData[active].to;

  return (
    <section className="block-pad pt-10">
      <div className="wrap">
        <h2 className="display h2" data-split>
          What I <span className="hl">reach for</span>
        </h2>
        <div
          className="beam"
          ref={beamRef}
          onMouseLeave={() => setCycling(true)}
        >
          <svg viewBox={`0 0 ${view.w || 1} ${view.h || 1}`} aria-hidden="true">
            {view.paths.map((p, i) => (
              <path
                key={i}
                className={clsx("bp", p.skill === active && "on")}
                d={p.d}
              />
            ))}
            {view.animate &&
              view.paths
                .filter((p) => p.skill === active)
                .map((p) => (
                  <circle key={`${active}-${p.d}`} className="pz" r="5">
                    <animateMotion
                      dur="1.3s"
                      repeatCount="indefinite"
                      path={p.d}
                    />
                  </circle>
                ))}
          </svg>
          <div className="bcol l">
            {skillsData.map((s, i) => (
              <button
                key={s.label}
                className={clsx("bk", i === active && "on")}
                type="button"
                onMouseEnter={() => pick(i)}
                onFocus={() => pick(i)}
                onClick={() => pick(i)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="bcol r">
            {skillTargets.map((t) => (
              <span
                key={t.id}
                className={clsx("bk", targets.includes(t.id) && "on")}
                data-id={t.id}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
