"use client";

import { ArrowDown, Sparkle } from "@phosphor-icons/react";
import Image from "next/image";
import Mark from "@/components/icons/Mark";
import { useLayoutEffect, useRef } from "react";
import { heroShots, rotatingWords, siteConfig } from "@/lib/data";
import {
  Draggable,
  gsap,
  InertiaPlugin,
  prefersReducedMotion,
  SplitText,
} from "@/lib/gsap";

// Hero: my photo in the middle with real product screenshots orbiting it at different
// depths. They fly out from behind me on load, float, drift away from the cursor, can be
// thrown around, and scatter outward as you scroll into the page.
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const rotRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const hero = ref.current;
    if (prefersReducedMotion() || !hero) return;
    let timer = 0;
    let drags: Draggable[] = [];
    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      const split = SplitText.create("#heroTitle .line", {
        type: "words,chars",
        charsClass: "ch",
      });
      gsap.from(split.chars, {
        opacity: 0,
        filter: "blur(12px)",
        yPercent: 30,
        duration: 0.7,
        ease: "expo.out",
        stagger: 0.022,
        delay: 0.15,
      });
      gsap.from(".now, .hero-foot > *", {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.08,
        delay: 0.5,
      });

      let word = 0;
      timer = window.setInterval(() => {
        const rot = rotRef.current;
        if (!rot) return;
        word = (word + 1) % rotatingWords.length;
        gsap
          .timeline()
          .to(rot, {
            opacity: 0,
            filter: "blur(10px)",
            y: -12,
            duration: 0.3,
            ease: "power2.in",
          })
          .call(() => {
            rot.textContent = rotatingWords[word];
          })
          .fromTo(
            rot,
            { opacity: 0, filter: "blur(10px)", y: 14 },
            {
              opacity: 1,
              filter: "blur(0px)",
              y: 0,
              duration: 0.5,
              ease: "expo.out",
            },
          );
      }, 2600);

      // The photo rises into its frame.
      gsap.from(".me-photo", {
        yPercent: 18,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        delay: 0.35,
      });
      gsap.from(".me-frame", {
        scaleY: 0,
        transformOrigin: "50% 100%",
        duration: 1,
        ease: "expo.inOut",
        delay: 0.15,
      });

      const orbits = gsap.utils.toArray<HTMLElement>(".orbit");
      const stage = hero.querySelector<HTMLElement>(".stage");
      if (!stage) return;

      orbits.forEach((orbit, i) => {
        const depth = Number(orbit.dataset.depth);
        const float = orbit.querySelector(".orbit-float");
        const card = orbit.querySelector(".orbit-card");

        // Fly out from behind the photo to its place.
        const s = stage.getBoundingClientRect();
        const o = orbit.getBoundingClientRect();
        gsap.from(card, {
          x: s.left + s.width / 2 - (o.left + o.width / 2),
          y: s.top + s.height * 0.55 - (o.top + o.height / 2),
          scale: 0.3,
          rotate: 0,
          opacity: 0,
          duration: 1.3,
          ease: "expo.out",
          delay: 0.7 + i * 0.08,
        });

        // Idle float, deeper cards move more.
        gsap.to(float, {
          y: 10 + depth * 10,
          rotate: i % 2 ? 1.5 : -1.5,
          duration: 3 + i * 0.45,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: i * 0.3,
        });

        // Scroll away: each card scatters outward from the photo and fades.
        const dir = orbit.dataset.side === "left" ? -1 : 1;
        gsap.to(orbit, {
          x: dir * (140 + depth * 160),
          y: -(80 + depth * 120),
          rotate: dir * 8,
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.to(".me", {
        yPercent: 12,
        scale: 0.94,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Cards drift away from the cursor by depth (mouse only).
      if (window.matchMedia("(pointer: fine)").matches) {
        const movers = orbits.map((orbit) => {
          const el = orbit.querySelector(".orbit-par");
          return {
            depth: Number(orbit.dataset.depth),
            x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
            y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
          };
        });
        const onMove = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          movers.forEach((m) => {
            m.x(-nx * 46 * m.depth);
            m.y(-ny * 30 * m.depth);
          });
        };
        const onLeave = () =>
          movers.forEach((m) => {
            m.x(0);
            m.y(0);
          });
        stage.addEventListener("pointermove", onMove);
        stage.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          stage.removeEventListener("pointermove", onMove);
          stage.removeEventListener("pointerleave", onLeave);
        });

        let z = 10;
        drags = Draggable.create(".orbit-card", {
          bounds: stage,
          inertia: true,
          edgeResistance: 0.7,
          onPress() {
            this.target.closest(".orbit").style.zIndex = String(++z);
            gsap.to(this.target, { scale: 1.04, duration: 0.2 });
          },
          onRelease() {
            gsap.to(this.target, { scale: 1, duration: 0.3 });
          },
          onDrag() {
            const vx = InertiaPlugin.getVelocity(this.target, "x");
            gsap.to(this.target, {
              rotation: gsap.utils.clamp(-14, 14, vx / 80),
              duration: 0.3,
              overwrite: "auto",
            });
          },
          onThrowComplete() {
            gsap.to(this.target, {
              rotation: gsap.utils.random(-5, 5),
              duration: 0.6,
              ease: "elastic.out(1, .5)",
            });
          },
        });
      }
    }, hero);

    return () => {
      window.clearInterval(timer);
      cleanups.forEach((fn) => fn());
      drags.forEach((d) => d.kill());
      ctx.revert();
    };
  }, []);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="wrap hero-head">
        <span className="now">
          <i aria-hidden="true" />
          <b>Now:</b> {siteConfig.now}
        </span>
        <h1
          className="display"
          id="heroTitle"
          aria-label="I build agents on solid backends."
        >
          <span className="line">
            I build{" "}
            <span className="rot" ref={rotRef}>
              {rotatingWords[0]}
            </span>
          </span>
          <span className="line">on solid backends.</span>
        </h1>
      </div>
      <div className="stage">
        <figure className="me">
          <span className="me-frame" aria-hidden="true" />
          {siteConfig.portrait ? (
            <Image
              className="me-photo"
              src={siteConfig.portrait.src}
              alt={siteConfig.portrait.alt}
              width={siteConfig.portrait.width}
              height={siteConfig.portrait.height}
              sizes="(max-width: 960px) 70vw, 420px"
              priority
            />
          ) : (
            <Mark className="me-photo me-mark" />
          )}
        </figure>
        {heroShots.map((shot) => (
          <figure
            key={shot.cls}
            className={`orbit ${shot.cls}`}
            data-depth={shot.depth}
            data-side={shot.side}
          >
            <div className="orbit-par">
              <div className="orbit-float">
                <div className="orbit-card win">
                  <div className="bar">
                    <span />
                    <span />
                    <span />
                    <em>{shot.label}</em>
                  </div>
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={1280}
                    height={shot.h}
                    sizes="(max-width: 960px) 40vw, 320px"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </figure>
        ))}
        <p className="sticker">Real builds, not mockups. Throw them around.</p>
      </div>
      <div className="wrap hero-foot">
        <p className="lede">
          Simon Nguyen, forward deployed and full-stack engineer in Melbourne. I
          ship AI into real operations, from the first workshop to on-prem.
        </p>
        <div className="ctas">
          <a className="btn btn-primary magnetic" href="#work">
            View work <ArrowDown className="ico" aria-hidden="true" />
          </a>
          <button className="btn btn-line" type="button" data-cmdk>
            <Sparkle className="ico" aria-hidden="true" /> Ask my CV
          </button>
        </div>
      </div>
    </section>
  );
}
