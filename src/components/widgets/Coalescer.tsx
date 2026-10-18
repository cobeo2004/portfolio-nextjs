"use client";

import { Lightning } from "@phosphor-icons/react";
import { useEffectEvent, useLayoutEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

type TPoint = { x: number; y: number; d: number };

// RSDecider: 100 identical requests collapse into one model run; asking again hits the cache.
export default function Coalescer() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slowRef = useRef<HTMLDivElement>(null);
  const fastRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const cached = useRef(false);
  const [runs, setRuns] = useState(0);
  const [done, setDone] = useState(0);
  const [label, setLabel] = useState("Send 100 identical questions");

  const fire = () => {
    const stage = stageRef.current;
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    if (busy.current || !stage || !cv || !ctx) return;
    busy.current = true;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = stage.clientWidth;
    const H = stage.clientHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue("--ink").trim();
    const cobalt = css.getPropertyValue("--cobalt").trim();
    const pts: TPoint[] = Array.from({ length: 100 }, () => ({
      x: W * (0.04 + Math.random() * 0.2),
      y: H * (0.12 + Math.random() * 0.76),
      d: Math.random() * 0.25,
    }));
    const cx = W * 0.48;
    const cy = H / 2;
    const mx = W * 0.82;
    const hit = cached.current;
    const slow = hit ? 0 : 1.4;
    const reduce = prefersReducedMotion();
    setDone(0);
    if (!hit) setRuns((n) => n + 1);

    gsap.fromTo(
      slowRef.current,
      { scaleX: 0 },
      { scaleX: hit ? 0 : 1, duration: hit ? 0.2 : 1.4, ease: "none" },
    );
    gsap.fromTo(
      fastRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.25, ease: "power2.out", delay: hit ? 0.6 : 2.2 },
    );

    const t0 = performance.now();
    const t1 = 1.15;
    const tb = t1 + 0.5 + slow;
    const frame = (now: number) => {
      const t = reduce ? tb + 1.2 : (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        if (t < 0.9 + p.d) {
          let k = Math.min(1, Math.max(0, (t - p.d) / 0.9));
          k = 1 - Math.pow(1 - k, 3);
          ctx.fillStyle = ink;
          ctx.globalAlpha = 0.75;
          ctx.fillRect(
            p.x + (cx - p.x) * k - 2.5,
            p.y + (cy - p.y) * k - 2.5,
            5,
            5,
          );
        }
      });
      ctx.globalAlpha = 1;
      if (t > t1 && t < tb) {
        const k = Math.min(1, (t - t1) / 0.5);
        const x = hit ? cx : cx + (mx - cx) * k;
        ctx.fillStyle = cobalt;
        ctx.fillRect(x - 6, cy - 6, 12, 12);
        if (hit) {
          ctx.font = '500 12px "IBM Plex Mono", monospace';
          ctx.fillText("cache hit", cx - 28, cy - 34);
        }
      }
      if (t >= tb) {
        let k = Math.min(1, (t - tb) / 0.8);
        k = 1 - Math.pow(1 - k, 3);
        ctx.fillStyle = cobalt;
        pts.forEach((p) =>
          ctx.fillRect(
            cx + (p.x - cx) * k - 2.5,
            cy + (p.y - cy) * k - 2.5,
            5,
            5,
          ),
        );
        setDone(Math.round(100 * k));
      }
      if (t < tb + 1.2) requestAnimationFrame(frame);
      else {
        busy.current = false;
        cached.current = true;
        setLabel("Ask the same again");
      }
    };
    requestAnimationFrame(frame);
  };

  // Plays once by itself the first time it scrolls into view.
  const autoFire = useEffectEvent(() => fire());
  useLayoutEffect(() => {
    if (!stageRef.current) return;
    const st = ScrollTrigger.create({
      trigger: stageRef.current,
      start: "top 70%",
      once: true,
      onEnter: () => window.setTimeout(autoFire, 300),
    });
    return () => st.kill();
  }, []);

  return (
    <div className="co">
      <div
        className="co-stage"
        ref={stageRef}
        aria-label="Animation: 100 identical requests are coalesced into one model run, then answered from cache."
      >
        <canvas ref={canvasRef} />
        <span className="co-node left-[14%]">100 clients</span>
        <span className="co-node left-[48%]">coalescer</span>
        <span className="co-node model left-[82%]">
          model
          <br />
          590 ms
        </span>
      </div>
      <div className="co-bars">
        <div className="co-bar">
          <span>model run</span>
          <div className="b" ref={slowRef} />
          <em>~590 ms</em>
        </div>
        <div className="co-bar fast">
          <span>cache hit</span>
          <div className="b max-w-[6px]" ref={fastRef} />
          <em>0.1 ms</em>
        </div>
      </div>
      <div className="co-ctl">
        <button className="btn btn-line h-11" type="button" onClick={fire}>
          <Lightning className="ico" aria-hidden="true" /> {label}
        </button>
        <span className="meta">
          model runs: <b>{runs}</b> / answered: <b>{done}</b>
        </span>
      </div>
    </div>
  );
}
