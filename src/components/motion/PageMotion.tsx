"use client";

import { useLayoutEffect } from "react";
import {
  gsap,
  prefersReducedMotion,
  ScrollTrigger,
  SplitText,
} from "@/lib/gsap";

// Scroll motion shared by every page, driven by data attributes in the markup:
//   data-split      headline lines rise through masks (data-now plays it on load)
//   data-rise       blocks rise and fade in; data-row rows slide in from the left
//   data-reveal     images wipe open from the bottom and settle
//   data-count      numbers count up (data-pre / data-suf around the value)
//   data-par        parallax by the given percent; data-drift sideways drift
//   data-light      a paragraph lights up word by word while scrolling
//   data-stack      sticky panels shrink back as the next one arrives
//   data-rise-band  the contact band's stair blocks
// Every scroll-in plays in reverse when you scroll back up past it.
export default function PageMotion() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const main = document.querySelector("main");
    if (!main) return;
    const q = <T extends Element = HTMLElement>(sel: string) =>
      Array.from(main.querySelectorAll<T & Element>(sel)) as T[];
    const cleanups: (() => void)[] = [];
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      q<HTMLElement>("[data-split]").forEach((h) => {
        const onLoad = h.hasAttribute("data-now");
        SplitText.create(h, {
          type: "lines",
          mask: "lines",
          linesClass: "ln",
          autoSplit: true,
          onSplit: (self) =>
            onLoad
              ? gsap.from(self.lines, {
                  yPercent: 105,
                  duration: 1,
                  ease: "expo.out",
                  stagger: 0.09,
                  delay: 0.25,
                })
              : gsap.fromTo(
                  self.lines,
                  { yPercent: 105 },
                  {
                    yPercent: 0,
                    duration: 1,
                    ease: "expo.out",
                    stagger: 0.09,
                    scrollTrigger: {
                      trigger: h,
                      start: "top 88%",
                      toggleActions: "play none none reverse",
                    },
                  },
                ),
        });
      });

      q<HTMLElement>("[data-par]").forEach((el) => {
        const amount = Number(el.dataset.par);
        gsap.fromTo(
          el,
          { yPercent: amount },
          {
            yPercent: -amount / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      q<HTMLElement>("[data-drift]").forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 0 },
          {
            xPercent: Number(el.dataset.drift),
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      const rise = q("[data-rise]");
      const rows = q("[data-row]");
      gsap.set(rise, { y: 56, opacity: 0 });
      gsap.set(rows, { x: -36, opacity: 0 });
      ScrollTrigger.batch(rise, {
        start: "top 88%",
        onEnter: (b) =>
          gsap.to(b, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.08,
            overwrite: true,
          }),
        onLeaveBack: (b) =>
          gsap.to(b, {
            y: 56,
            opacity: 0,
            duration: 0.6,
            ease: "power2.in",
            stagger: { each: 0.06, from: "end" },
            overwrite: true,
          }),
      });
      ScrollTrigger.batch(rows, {
        start: "top 92%",
        onEnter: (b) =>
          gsap.to(b, {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.07,
            overwrite: true,
          }),
        onLeaveBack: (b) =>
          gsap.to(b, {
            x: -36,
            opacity: 0,
            duration: 0.5,
            ease: "power2.in",
            stagger: { each: 0.05, from: "end" },
            overwrite: true,
          }),
      });

      q<HTMLElement>("[data-reveal]").forEach((el) => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        tl.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" },
        );
        if (img)
          tl.fromTo(
            img,
            { scale: 1.25 },
            { scale: 1, duration: 1.4, ease: "expo.out" },
            0.1,
          );
      });

      q<HTMLElement>("[data-count]").forEach((el) => {
        const counter = { v: 0 };
        const pre = el.dataset.pre ?? "";
        const suf = el.dataset.suf ?? "";
        gsap.to(counter, {
          v: Number(el.dataset.count),
          duration: 1.4,
          ease: "power3.out",
          onUpdate: () => {
            el.textContent = `${pre}${Math.round(counter.v)}${suf}`;
          },
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });

      q<HTMLElement>("[data-light]").forEach((p) => {
        const split = SplitText.create(p, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.14 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: {
              trigger: p,
              start: "top 80%",
              end: "bottom 45%",
              scrub: true,
            },
          },
        );
      });

      // The marquee drifts on its own, then speeds up and flips with the scroll direction.
      q<HTMLElement>(".marquee-track").forEach((track) => {
        const tween = gsap.to(track, {
          xPercent: -50,
          duration: 38,
          ease: "none",
          repeat: -1,
        });
        ScrollTrigger.create({
          trigger: track,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (s) => {
            const v = Math.abs(s.getVelocity() / 260);
            gsap.to(tween, {
              timeScale: s.direction * Math.max(1, Math.min(6, v)),
              duration: 0.3,
              overwrite: true,
            });
            gsap.to(tween, {
              timeScale: s.direction,
              duration: 1.2,
              delay: 0.3,
            });
          },
        });
      });

      mm.add("(min-width: 961px)", () => {
        q<HTMLElement>("[data-stack]").forEach((stack) => {
          const panels = Array.from(
            stack.querySelectorAll<HTMLElement>(".panel"),
          );
          panels.slice(0, -1).forEach((panel, i) => {
            const st = {
              trigger: panels[i + 1],
              start: "top bottom",
              end: "top 20%",
              scrub: true,
            };
            gsap.to(panel, { scale: 0.94, ease: "none", scrollTrigger: st });
            gsap.to(panel.querySelector(".dim"), {
              opacity: 0.65,
              ease: "none",
              scrollTrigger: { ...st },
            });
          });
        });
      });

      const band = q("[data-rise-band]");
      if (band.length)
        gsap.fromTo(
          band,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".band",
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );

      // Screenshots tilt toward the pointer.
      q<HTMLElement>(".tilt").forEach((el) => {
        const host = el.parentElement;
        if (!host) return;
        const rx = gsap.quickTo(el, "rotationX", {
          duration: 0.5,
          ease: "power3",
        });
        const ry = gsap.quickTo(el, "rotationY", {
          duration: 0.5,
          ease: "power3",
        });
        gsap.set(el, { transformPerspective: 1200 });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        host.addEventListener("pointermove", move);
        host.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerleave", leave);
        });
      });

      // Magnetic primary call to action.
      q<HTMLElement>(".magnetic").forEach((el) => {
        const xt = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
        const yt = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xt(
            gsap.utils.clamp(-8, 8, (e.clientX - r.left - r.width / 2) * 0.25),
          );
          yt(gsap.utils.clamp(-6, 6, (e.clientY - r.top - r.height / 2) * 0.3));
        };
        const leave = () => {
          xt(0);
          yt(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }, main);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      cleanups.forEach((fn) => fn());
      mm.revert();
      ctx.revert();
    };
  }, []);

  return null;
}
