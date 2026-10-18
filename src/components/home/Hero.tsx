"use client";

import { ArrowDown, Sparkle } from "@phosphor-icons/react";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { rotatingWords, siteConfig } from "@/lib/data";
import {
  Draggable,
  gsap,
  InertiaPlugin,
  prefersReducedMotion,
  SplitText,
} from "@/lib/gsap";

const windows = [
  {
    cls: "w-foundry",
    label: "software-factory",
    src: "/img/foundry.webp",
    w: 1280,
    h: 800,
    alt: "Software Factory board: coding agent runs queued, planning, building and in review, with a plan waiting for approval",
  },
  {
    cls: "w-daily",
    label: "dailyos",
    src: "/img/dailyos.webp",
    w: 1280,
    h: 711,
    alt: "DailyOS Today view: tasks, a focus goal and a day timeline",
  },
  {
    cls: "w-trust",
    label: "trustlane.house-of-imaginaries.com",
    src: "/img/trustlane.webp",
    w: 1280,
    h: 740,
    alt: "TrustLane landing page: Hours back on every claim, over the claims dashboard",
  },
  {
    cls: "w-zth",
    label: "from-zero-to-hero",
    src: "/img/zth.webp",
    w: 1280,
    h: 800,
    alt: "From Zero to Hero landing page with three app screens",
  },
];

// Hero: the headline blurs in letter by letter, one word keeps rotating, and real product
// shots sit on a desk you can throw around.
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const rotRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !ref.current) return;
    let timer = 0;
    let drags: Draggable[] = [];
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
      gsap.from(".now, .hero-row > *", {
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

      // The copy drifts up and fades as you scroll away.
      gsap.to(".hero > .wrap:first-child", {
        y: -80,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "+=560",
          scrub: true,
        },
      });

      gsap.from(".win", {
        y: 120,
        rotate: 0,
        opacity: 0,
        duration: 1.1,
        ease: "back.out(1.4)",
        stagger: 0.12,
        delay: 0.7,
      });
      gsap.from(".sticker", {
        scale: 0,
        rotate: -30,
        duration: 0.6,
        ease: "back.out(2)",
        delay: 1.6,
      });
      gsap.fromTo(
        "#desk",
        { rotateX: 16, scale: 0.96 },
        {
          rotateX: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".desk-wrap",
            start: "top 85%",
            end: "top 25%",
            scrub: true,
          },
        },
      );

      if (window.matchMedia("(pointer: fine)").matches) {
        let z = 10;
        drags = Draggable.create(".win", {
          bounds: "#desk",
          inertia: true,
          edgeResistance: 0.7,
          onPress() {
            this.target.style.zIndex = String(++z);
            gsap.to(this.target, { scale: 1.03, duration: 0.2 });
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
    }, ref);

    return () => {
      window.clearInterval(timer);
      ctx.revert();
      drags.forEach((d) => d.kill());
    };
  }, []);

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="wrap">
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
        <div className="hero-row">
          <p className="lede">
            Simon Nguyen, forward deployed and full-stack engineer in Melbourne.
            I ship AI into real operations, from the first workshop to on-prem.
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
      </div>
      <div className="wrap desk-wrap">
        <div className="desk" id="desk">
          <div className="stair s1" data-par="40" />
          <div className="stair s2" data-par="20" />
          <div className="stair s3" data-par="60" />
          <div className="stair s4" data-par="30" />
          {windows.map((w) => (
            <figure key={w.cls} className={`win m-0 ${w.cls}`}>
              <div className="bar">
                <span />
                <span />
                <span />
                <em>{w.label}</em>
              </div>
              <Image
                src={w.src}
                alt={w.alt}
                width={w.w}
                height={w.h}
                sizes="(max-width: 960px) 70vw, 520px"
                draggable={false}
                priority
              />
            </figure>
          ))}
          <p className="sticker">Real builds, not mockups. Drag them around.</p>
        </div>
      </div>
    </section>
  );
}
