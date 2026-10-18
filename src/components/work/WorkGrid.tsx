"use client";

import { ArrowRight } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import TransitionLink from "@/components/navigation/TransitionLink";
import { projectFilters, projectsData } from "@/lib/data";
import { Flip, gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import type { TProject, TProjectFilter } from "@/types";

const toneClass = { cobalt: "t-cobalt", ink: "t-ink", soft: "t-soft" };

const CardBody = ({ project }: { project: TProject }) => (
  <>
    <div
      className={clsx(
        "wthumb",
        project.thumb.kind === "tile" && [
          "type",
          toneClass[project.thumb.tone],
        ],
      )}
    >
      {project.thumb.kind === "image" ? (
        <Image
          src={project.thumb.src}
          alt={project.thumb.alt}
          width={1280}
          height={800}
          sizes="(max-width: 960px) 100vw, 60vw"
        />
      ) : (
        <>
          <b>{project.thumb.big}</b>
          <span>{project.thumb.small}</span>
        </>
      )}
    </div>
    <div className="wbody">
      <div className="wtop">
        <span className="meta">{project.meta}</span>
      </div>
      <h3 className="display">
        {project.title}
        {project.hl && <span className="hl">{project.hl}</span>}
      </h3>
      <p>{project.desc}</p>
      {project.link ? (
        <span className="wgo">
          {project.link.label} <ArrowRight className="ico" aria-hidden="true" />
        </span>
      ) : (
        <span className="wgo soon">Case study coming</span>
      )}
    </div>
  </>
);

const count = (key: TProjectFilter["key"]) =>
  key === "all"
    ? projectsData.length
    : projectsData.filter((p) => p.cats.includes(key)).length;

// All twelve projects with filters; cards re-flow with a Flip animation.
export default function WorkGrid() {
  const [filter, setFilter] = useState<TProjectFilter["key"]>("all");
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const choose = (key: TProjectFilter["key"]) => {
    if (gridRef.current && !prefersReducedMotion())
      flipState.current = Flip.getState(
        gridRef.current.querySelectorAll(".wcard"),
      );
    setFilter(key);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state) {
      ScrollTrigger.refresh();
      return;
    }
    Flip.from(state, {
      duration: 0.7,
      ease: "expo.inOut",
      stagger: 0.03,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.92 },
          { opacity: 1, scale: 1, duration: 0.5 },
        ),
      onLeave: (els) =>
        gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.35 }),
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
        <div className="wgrid" ref={gridRef}>
          {projectsData.map((project) => {
            const hidden = filter !== "all" && !project.cats.includes(filter);
            const className = clsx(
              "wcard",
              project.size !== "half" && project.size,
            );
            const body = <CardBody project={project} />;
            if (!project.link)
              return (
                <div
                  key={project.slug}
                  className={className}
                  data-rise
                  hidden={hidden}
                >
                  {body}
                </div>
              );
            return project.link.external ? (
              <a
                key={project.slug}
                className={className}
                data-rise
                hidden={hidden}
                href={project.link.href}
                target="_blank"
                rel="noopener"
              >
                {body}
              </a>
            ) : (
              <TransitionLink
                key={project.slug}
                className={className}
                data-rise
                hidden={hidden}
                href={project.link.href}
              >
                {body}
              </TransitionLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
