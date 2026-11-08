"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

// Elements that change the cursor. data-cursor picks a state by name ("view", "visit",
// "drag"), and data-cursor-label overrides its word. Other links and buttons get "link".
const TARGETS = "[data-cursor], a, button, [role='button'], label, summary";
// Over text fields the system caret is clearer, so the custom cursor steps aside.
const TEXT = "input, textarea, select, [contenteditable='true']";
const LABELS: Record<string, string> = {
  view: "View",
  visit: "Visit",
  drag: "Drag",
};

// A precise dot with a soft ring that trails behind it and stretches like a droplet when the
// pointer moves fast. Over projects the ring grows and names the action, and a click sends a
// ripple out from the dot. Mouse and trackpad only; skipped on touch and under reduced motion.
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const dot = root.querySelector<HTMLElement>(".cursor-dot");
    const ring = root.querySelector<HTMLElement>(".cursor-ring");
    const label = root.querySelector<HTMLElement>(".cursor-label");
    if (!dot || !ring || !label) return;

    const html = document.documentElement;
    html.classList.add("has-cursor");
    const pos = { x: -100, y: -100 };
    const trail = { x: -100, y: -100, scale: 1, target: 1 };
    let shown = false;

    const setState = (state: string, word = "") => {
      if (root.dataset.state === state && label.textContent === word) return;
      root.dataset.state = state;
      label.textContent = word;
      trail.target =
        state === "view" || state === "visit" || state === "drag"
          ? 2.6
          : state === "link"
            ? 1.5
            : 1;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      // The dot is never late: it is placed straight from the event.
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      if (!shown) {
        shown = true;
        trail.x = pos.x;
        trail.y = pos.y;
        root.dataset.hidden = "false";
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      if (el?.closest(TEXT)) {
        setState("text");
        return;
      }
      const hit = el?.closest<HTMLElement>(TARGETS);
      if (!hit || hit.matches(":disabled, [aria-disabled='true']")) {
        setState("");
        return;
      }
      const named = hit.dataset.cursor;
      if (named)
        setState(named, hit.dataset.cursorLabel ?? LABELS[named] ?? "");
      else setState("link");
    };

    const tick = () => {
      const dx = pos.x - trail.x;
      const dy = pos.y - trail.y;
      trail.x += dx * 0.2;
      trail.y += dy * 0.2;
      trail.scale += (trail.target - trail.scale) * 0.18;
      // Stretch along the direction of travel, like a drop pulled behind the dot.
      const speed = Math.min(Math.hypot(dx, dy) / 70, 0.45);
      const angle = Math.atan2(dy, dx);
      const s = trail.scale;
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) rotate(${angle}rad) scale(${s * (1 + speed)}, ${s * (1 - speed * 0.5)})`;
      label.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0)`;
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      trail.scale *= 0.78;
      const ripple = document.createElement("span");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      root.append(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0.2, opacity: 0.55 },
        {
          scale: 3.2,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
          onComplete: () => ripple.remove(),
        },
      );
    };

    // Hide when the pointer leaves the window, so a stray ring never sits at the edge.
    const onOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      shown = false;
      root.dataset.hidden = "true";
    };

    gsap.ticker.add(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("mouseout", onOut);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("mouseout", onOut);
      html.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" ref={ref} data-hidden="true" aria-hidden="true">
      <span className="cursor-ring" />
      <span className="cursor-label" />
      <span className="cursor-dot" />
    </div>
  );
}
