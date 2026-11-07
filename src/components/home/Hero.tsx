"use client";

import { ArrowDown, Sparkle } from "@phosphor-icons/react";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import Mark from "@/components/icons/Mark";
import { heroRoles, siteConfig } from "@/lib/data";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

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

// Hero: my cut-out portrait in the middle with a soft cobalt glow, the role I am hiring for on
// the left (it cycles), and a short hello on the right, all over a quiet field of stars.
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const hero = ref.current;
    if (prefersReducedMotion() || !hero) return;
    let timer = 0;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".hero-stars", { opacity: 0, duration: 1.6 }, 0)
        .from(".me-glow", { scale: 0.4, opacity: 0, duration: 1.6 }, 0.1)
        .from(
          ".me-photo",
          { y: 60, opacity: 0, filter: "blur(16px)", duration: 1.4 },
          0.2,
        )
        .from(
          ".hero-left > *",
          {
            x: -32,
            opacity: 0,
            filter: "blur(10px)",
            duration: 1,
            stagger: 0.1,
          },
          0.5,
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

      // The role on the left blurs out and the next one blurs in.
      let i = 0;
      timer = window.setInterval(() => {
        const role = roleRef.current;
        if (!role) return;
        i = (i + 1) % heroRoles.length;
        gsap
          .timeline()
          .to(role, {
            opacity: 0,
            filter: "blur(12px)",
            y: -10,
            duration: 0.45,
            ease: "power2.in",
          })
          .call(() => {
            role.textContent = heroRoles[i];
          })
          .fromTo(
            role,
            { opacity: 0, filter: "blur(12px)", y: 14 },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 0.7,
              ease: "expo.out",
            },
          );
      }, 3200);

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
      window.clearInterval(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero" id="top" ref={ref}>
      <Starfield />
      <span className="hero-haze" aria-hidden="true" />
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
