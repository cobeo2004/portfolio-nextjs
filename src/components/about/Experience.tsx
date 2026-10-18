"use client";

import { Plus } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { experienceData } from "@/lib/data";

// Accordion of roles; the current role starts open.
export default function Experience() {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className="block-pad pt-10" id="experience">
      <div className="wrap">
        <h2 className="display h2" data-split>
          Where I&apos;ve <span className="hl">shipped</span>
        </h2>
        <div className="xp">
          {experienceData.map((role, i) => (
            <div
              key={role.org}
              data-row
              className={clsx("xrow", open.has(i) && "open")}
            >
              <button
                className="xhead"
                type="button"
                aria-expanded={open.has(i)}
                onClick={() => toggle(i)}
              >
                <span
                  className={clsx(
                    "mono-t",
                    role.logo && "has-logo",
                    role.logo?.fill && "fill",
                  )}
                >
                  {role.logo ? (
                    <Image
                      src={role.logo.src}
                      alt={role.logo.alt}
                      width={64}
                      height={64}
                      unoptimized={role.logo.src.endsWith(".svg")}
                    />
                  ) : (
                    role.mono
                  )}
                </span>
                <span>
                  <h3>{role.title}</h3>
                  <div className="org">{role.org}</div>
                </span>
                <span className="when">{role.when}</span>
                <span className="tw">
                  <Plus className="ico" aria-hidden="true" />
                </span>
              </button>
              <div className="xbody">
                <div>
                  <ul>
                    {role.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
