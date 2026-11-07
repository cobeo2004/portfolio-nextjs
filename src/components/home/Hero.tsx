"use client";

import { ArrowDown, Sparkle } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import HeroReveal from "@/components/home/HeroReveal";
import Mark from "@/components/icons/Mark";
import LiquidEther from "@/components/motion/LiquidEther";
import { useSite } from "@/hooks/useSite";
import { heroRoles, siteConfig } from "@/lib/data";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import type { TTheme } from "@/types";

type TStar = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  d: number;
};

// A slow field of stars behind the hero. Stars twinkle, drift a little, and shift with the
// cursor by depth. Colour follows the theme (ink dots on paper, light dots on dark).
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reduce = prefersReducedMotion();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let stars: TStar[] = [];
    let w = 0;
    let h = 0;
    let frame = 0;
    let color = "#fff";
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const readColor = () => {
      color = getComputedStyle(document.documentElement)
        .getPropertyValue("--ink")
        .trim();
    };
    const size = () => {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.3,
        a: Math.random() * 0.6 + 0.15,
        tw: Math.random() * Math.PI * 2,
        d: Math.random() * 0.9 + 0.1,
      }));
    };
    const draw = () => {
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const s of stars) {
        if (!reduce) {
          s.tw += 0.02 * s.d;
          s.y -= 0.04 * s.d;
          if (s.y < -2) s.y = h + 2;
        }
        const x = s.x - mouse.x * 18 * s.d;
        const y = s.y - mouse.y * 12 * s.d;
        ctx.globalAlpha = s.a * (0.6 + 0.4 * Math.sin(s.tw));
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) frame = requestAnimationFrame(draw);
    };
    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth - 0.5;
      mouse.ty = e.clientY / window.innerHeight - 0.5;
    };

    readColor();
    size();
    draw();
    const themeWatch = new MutationObserver(() => {
      readColor();
      if (reduce) draw();
    });
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const ro = new ResizeObserver(() => {
      size();
      if (reduce) draw();
    });
    ro.observe(cv);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      themeWatch.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="hero-stars" aria-hidden="true" />;
}

// Ink colours for the liquid behind the hero, slow to fast, per theme.
const liquidInk: Record<TTheme, string[]> = {
  light: ["#1f4bff", "#5a78ff", "#a9b8ff"],
  dark: ["#1e36b8", "#4d74ff", "#a9bcff"],
  wizard: ["#6b4a0f", "#f2b33d", "#ffe3a3"],
};

// Builds the role as words of single letters, so each letter can drift and blur on its own.
// Words stay unbroken so the title still wraps between words.
function spell(el: HTMLElement, text: string) {
  el.textContent = "";
  const chars: HTMLElement[] = [];
  text.split(" ").forEach((word, i) => {
    if (i > 0) el.append(" ");
    const w = document.createElement("span");
    w.className = "role-word";
    for (const c of word) {
      const ch = document.createElement("span");
      ch.className = "role-ch";
      ch.textContent = c;
      w.append(ch);
      chars.push(ch);
    }
    el.append(w);
  });
  return chars;
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

// Letters arrive one after another, each settling out of a blur from a small sideways offset.
function vaporIn(chars: HTMLElement[], em: number) {
  return gsap.fromTo(
    chars,
    {
      opacity: 0,
      filter: "blur(10px)",
      x: () => rand(-0.35, 0.35) * em,
      y: () => rand(0.05, 0.25) * em,
    },
    {
      opacity: 1,
      filter: "blur(0px)",
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.028,
    },
  );
}

// Letters leave like vapour: each one rises, drifts aside, blurs and fades.
function vaporOut(chars: HTMLElement[], em: number) {
  return gsap.to(chars, {
    opacity: 0,
    filter: "blur(8px)",
    x: () => rand(-0.5, 0.5) * em,
    y: () => rand(-0.9, -0.35) * em,
    duration: 0.6,
    ease: "power2.in",
    stagger: 0.022,
  });
}

// Hero: my cut-out portrait in the middle with a soft cobalt glow, the role on the left (it
// cycles through heroRoles letter by letter), and a short hello on the right, over a quiet
// field of stars.
export default function Hero() {
  const { theme } = useSite();
  const ref = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const hero = ref.current;
    const role = roleRef.current;
    if (prefersReducedMotion() || !hero || !role) return;

    const ctx = gsap.context(() => {
      const em = () => parseFloat(getComputedStyle(role).fontSize) || 40;
      let chars = spell(role, heroRoles[0]);

      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(
          ".hero-liquid",
          { opacity: 0, duration: 2, clearProps: "opacity" },
          0,
        )
        .from(".hero-stars", { opacity: 0, duration: 1.6 }, 0)
        .from(".me-glow", { scale: 0.4, opacity: 0, duration: 1.6 }, 0.1)
        .from(
          ".me-photo",
          { y: 60, opacity: 0, filter: "blur(16px)", duration: 1.4 },
          0.2,
        )
        .add(vaporIn(chars, em()), 0.45)
        .from(
          ".hero-left .ctas",
          { x: -32, opacity: 0, filter: "blur(10px)", duration: 1 },
          0.9,
        )
        .from(
          ".hero-right > *",
          {
            x: 32,
            opacity: 0,
            filter: "blur(10px)",
            duration: 1,
            stagger: 0.08,
          },
          0.6,
        );

      // The glow breathes slowly behind the portrait.
      gsap.to(".me-glow", {
        scale: 1.08,
        opacity: 0.85,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Every few seconds the role evaporates and the next one condenses in its place. The
      // chain runs later, so ctx.add keeps its tweens in this context for cleanup.
      let i = 0;
      const next = () =>
        ctx.add(() => {
          i = (i + 1) % heroRoles.length;
          const size = em();
          vaporOut(chars, size).then(() =>
            ctx.add(() => {
              chars = spell(role, heroRoles[i]);
              vaporIn(chars, size).eventCallback("onComplete", () => {
                ctx.add(() => gsap.delayedCall(2.2, next));
              });
            }),
          );
        });
      gsap.delayedCall(3.4, next);

      // Scrolling away: the columns part and blur out, the portrait sinks back.
      const st = {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };
      gsap.to(".hero-left", {
        x: -80,
        opacity: 0,
        filter: "blur(8px)",
        ease: "none",
        scrollTrigger: st,
      });
      gsap.to(".hero-right", {
        x: 80,
        opacity: 0,
        filter: "blur(8px)",
        ease: "none",
        scrollTrigger: { ...st },
      });
      gsap.to(".me", {
        yPercent: 14,
        scale: 0.9,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { ...st },
      });
    }, hero);

    return () => {
      ctx.revert();
      role.textContent = heroRoles[0];
    };
  }, []);

  return (
    <section className="hero" id="top" ref={ref}>
      <LiquidEther
        className="hero-liquid"
        colors={liquidInk[theme]}
        lightMode={theme === "light"}
        mouseForce={18}
        cursorSize={110}
        autoSpeed={0.4}
        autoIntensity={1.8}
        clickBurst={false}
      />
      <Starfield />
      <span className="hero-haze" aria-hidden="true" />
      <HeroReveal />
      <div className="wrap hero-grid">
        <div className="hero-left">
          <h1
            className="display"
            aria-label={`${siteConfig.name}, ${siteConfig.role.toLowerCase()}`}
          >
            <span className="role" ref={roleRef} aria-hidden="true">
              {heroRoles[0]}
            </span>
          </h1>
          <div className="ctas">
            <a className="btn btn-primary magnetic" href="#work">
              View work <ArrowDown className="ico" aria-hidden="true" />
            </a>
            <button className="btn btn-line" type="button" data-cmdk>
              <Sparkle className="ico" aria-hidden="true" /> Ask my CV
            </button>
          </div>
        </div>
        <figure className="me">
          <span className="me-glow" aria-hidden="true" />
          {siteConfig.portrait ? (
            <Image
              className="me-photo"
              src={siteConfig.portrait.src}
              alt={siteConfig.portrait.alt}
              width={siteConfig.portrait.width}
              height={siteConfig.portrait.height}
              sizes="(max-width: 960px) 70vw, 460px"
              priority
            />
          ) : (
            <Mark className="me-photo me-mark" />
          )}
        </figure>
        <div className="hero-right">
          <span className="hello">Hi, I&apos;m Simon</span>
          <p className="hero-lead">I build agents on solid backends.</p>
          <p className="hero-sub">
            Forward deployed and full-stack engineer in Melbourne. I ship AI
            into real operations, from the first workshop to on-prem: models
            reason, plain code checks the rules, and a person signs off.
          </p>
          <span className="now">
            <i aria-hidden="true" />
            <b>Now:</b> {siteConfig.now}
          </span>
        </div>
      </div>
    </section>
  );
}
