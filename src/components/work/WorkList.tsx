"use client";

import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import TransitionLink from "@/components/navigation/TransitionLink";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { projectFilters, projectsData } from "@/lib/data";
import { Flip, gsap, ScrollTrigger } from "@/lib/gsap";
import type { TProject, TProjectFilter } from "@/types";

const toneClass = { cobalt: "t-cobalt", ink: "t-ink", soft: "t-soft" };
const PREVIEW_W = 380;
const PREVIEW_H = (PREVIEW_W * 10) / 16;

const ProjectMedia = ({ project }: { project: TProject }) => (
  <div
    className={clsx(
      "wthumb",
      project.thumb.kind === "tile" && ["type", toneClass[project.thumb.tone]],
    )}
  >
    {project.thumb.kind === "image" ? (
      <Image
        src={project.thumb.src}
        alt=""
        width={1280}
        height={800}
        sizes="(max-width: 960px) 100vw, 380px"
      />
    ) : (
      <>
        <b>{project.thumb.big}</b>
        <span>{project.thumb.small}</span>
      </>
    )}
  </div>
);

const count = (key: TProjectFilter["key"]) =>
  key === "all"
    ? projectsData.length
    : projectsData.filter((p) => p.cats.includes(key)).length;

// All twelve projects as one readable list. With a mouse, a preview of the hovered project
// follows the cursor, tilts with its speed and wipes between projects; on touch, small
// screens and reduced motion each row shows its thumbnail inline instead.
export default function WorkList() {
  const [filter, setFilter] = useState<TProjectFilter["key"]>("all");
  const [current, setCurrent] = useState(-1);
  const floating = useMediaQuery(
    "(hover: hover) and (pointer: fine) and (min-width: 961px) and (prefers-reduced-motion: no-preference)",
  );
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const move = useRef<{
    x: (v: number) => void;
    y: (v: number) => void;
    r: (v: number) => void;
  } | null>(null);
  const lastX = useRef(0);
  const settle = useRef(0);

  useLayoutEffect(() => {
    const el = previewRef.current;
    if (!floating || !el) return;
    gsap.set(el, { scale: 0, opacity: 0 });
    move.current = {
      x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" }),
      y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" }),
      r: gsap.quickTo(el, "rotation", { duration: 0.5, ease: "power3" }),
    };
    return () => {
      move.current = null;
      gsap.killTweensOf(el);
    };
  }, [floating]);

  // Wipe the newly hovered project in over the previous one.
  useLayoutEffect(() => {
    const el = previewRef.current;
    if (!floating || !el || current < 0) return;
    const media = el.querySelectorAll<HTMLElement>(".wl-media");
    media.forEach((m, i) => (m.style.zIndex = i === current ? "2" : "1"));
    gsap.fromTo(
      media[current],
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.55,
        ease: "expo.out",
        overwrite: true,
        onComplete: () =>
          media.forEach((m, i) => {
            if (i !== current) m.style.clipPath = "inset(100% 0% 0% 0%)";
          }),
      },
    );
  }, [current, floating]);

  const place = (x: number, y: number) => {
    const left =
      x + 28 + PREVIEW_W > window.innerWidth ? x - 28 - PREVIEW_W : x + 28;
    move.current?.x(left);
    move.current?.y(y - PREVIEW_H / 2);
  };

  const show = (i: number) => {
    setCurrent(i);
    gsap.to(previewRef.current, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: "back.out(1.6)",
      overwrite: "auto",
    });
  };

  const hide = () =>
    gsap.to(previewRef.current, {
      scale: 0.6,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      overwrite: "auto",
    });

  const onPointerMove = (e: React.PointerEvent) => {
    if (!floating) return;
    place(e.clientX, e.clientY);
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    move.current?.r(gsap.utils.clamp(-10, 10, dx * 0.4));
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => move.current?.r(0), 90);
  };

  // Keyboard users get the same preview, parked beside the focused row.
  const onFocusRow = (i: number, e: React.FocusEvent<HTMLElement>) => {
    if (!floating) return;
    const r = e.currentTarget.getBoundingClientRect();
    place(r.right - PREVIEW_W - 220, r.top + r.height / 2);
    show(i);
  };

  const choose = (key: TProjectFilter["key"]) => {
    if (listRef.current)
      flipState.current = Flip.getState(
        listRef.current.querySelectorAll(".wl-item"),
      );
    setFilter(key);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state) return;
    Flip.from(state, {
      duration: 0.6,
      ease: "expo.inOut",
      stagger: 0.025,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, x: -24 },
          { opacity: 1, x: 0, duration: 0.5 },
        ),
      onLeave: (els) => gsap.to(els, { opacity: 0, x: 24, duration: 0.3 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [filter]);

  return (
    <section className="pb-24">
      <div className="wrap">
        <div className="filters" role="group" aria-label="Filter projects">
          {projectFilters.map((f) => (
            <button
              key={f.key}
              className="fbtn"
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => choose(f.key)}
            >
              {f.label} <b>{count(f.key)}</b>
            </button>
          ))}
        </div>
        <ul
          ref={listRef}
          className={clsx("wlist", !floating && "inline")}
          onPointerMove={onPointerMove}
          onPointerLeave={hide}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
          }}
        >
          {projectsData.map((project, i) => {
            const hidden = filter !== "all" && !project.cats.includes(filter);
            const body = (
              <>
                <span className="wl-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="wl-main">
                  <span className="wl-title display">
                    {project.title}
                    {project.hl && <span className="hl">{project.hl}</span>}
                  </span>
                  <span className="wl-desc">{project.desc}</span>
                </span>
                <span className="wl-meta">{project.meta}</span>
                {project.link ? (
                  <span className="wl-go">
                    {project.link.label}
                    {project.link.external ? (
                      <ArrowUpRight className="ico" aria-hidden="true" />
                    ) : (
                      <ArrowRight className="ico" aria-hidden="true" />
                    )}
                  </span>
                ) : (
                  <span className="wl-go soon">Case study coming</span>
                )}
                <span className="wl-thumb" aria-hidden="true">
                  <ProjectMedia project={project} />
                </span>
              </>
            );
            const rowProps = {
              className: "wl-row",
              onPointerEnter: () => floating && show(i),
              onFocus: (e: React.FocusEvent<HTMLElement>) => onFocusRow(i, e),
            };
            return (
              <li
                key={project.slug}
                className="wl-item"
                data-row
                hidden={hidden}
              >
                {!project.link ? (
                  <div {...rowProps}>{body}</div>
                ) : project.link.external ? (
                  <a
                    {...rowProps}
                    href={project.link.href}
                    target="_blank"
                    rel="noopener"
                  >
                    {body}
                  </a>
                ) : (
                  <TransitionLink {...rowProps} href={project.link.href}>
                    {body}
                  </TransitionLink>
                )}
              </li>
            );
          })}
        </ul>
        {floating && (
          <div className="wl-preview" ref={previewRef} aria-hidden="true">
            {projectsData.map((project) => (
              <div key={project.slug} className="wl-media">
                <ProjectMedia project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
