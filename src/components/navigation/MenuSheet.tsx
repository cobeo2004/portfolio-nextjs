"use client";

import {
  FileText,
  GithubLogo,
  LinkedinLogo,
  MoonStars,
} from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useSite } from "@/hooks/useSite";
import { navItems, siteConfig } from "@/lib/data";
import TransitionLink from "./TransitionLink";

type TMenuSheetProps = {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  current: string;
};

const previews: Record<string, React.ReactNode> = {
  home: <Image src="/img/dailyos.webp" alt="" width={1280} height={711} />,
  work: <Image src="/img/trustlane.webp" alt="" width={1280} height={740} />,
  case: (
    <>
      <b>Top 1</b>
      <span>of 350+ teams, Agentic AI Build Week 2026</span>
    </>
  ),
  about: (
    <>
      <b>5 roles</b>
      <span>across agencies, startups, a gold mine and client delivery</span>
    </>
  ),
  contact: <Image src="/img/foundry.webp" alt="" width={1280} height={800} />,
};

// The menu sheet grows out of the menu button as a circle, then the items rise through masks.
export default function MenuSheet({ buttonRef, current }: TMenuSheetProps) {
  const { menuOpen, setMenuOpen } = useSite();
  const [hovered, setHovered] = useState<string | null>(null);
  const [wasOpen, setWasOpen] = useState(menuOpen);
  // Each time the sheet opens, the preview starts on the current page.
  if (wasOpen !== menuOpen) {
    setWasOpen(menuOpen);
    setHovered(null);
  }
  const preview = hovered ?? current;
  const sheetRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  // Keep the circle anchored on the button, both opening and closing.
  useEffect(() => {
    const btn = buttonRef.current;
    const sheet = sheetRef.current;
    if (!btn || !sheet) return;
    const r = btn.getBoundingClientRect();
    sheet.style.setProperty("--mx", `${r.left + r.width / 2}px`);
    sheet.style.setProperty("--my", `${r.top + r.height / 2}px`);
  }, [menuOpen, buttonRef]);

  // Everything behind the sheet goes inert; focus moves in and comes back on close.
  useEffect(() => {
    const outside = Array.from(
      document.querySelectorAll<HTMLElement>("main, footer"),
    );
    if (!menuOpen) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    outside.forEach((el) => (el.inert = true));
    const t = window.setTimeout(() => {
      const first =
        sheetRef.current?.querySelector<HTMLElement>(
          ".mnav-item[aria-current]",
        ) ?? sheetRef.current?.querySelector<HTMLElement>(".mnav-item");
      first?.focus({ preventScroll: true });
    }, 280);
    return () => {
      window.clearTimeout(t);
      outside.forEach((el) => (el.inert = false));
      lastFocus.current?.focus?.({ preventScroll: true });
    };
  }, [menuOpen]);

  // Trap Tab between the menu button and the sheet while it is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !sheetRef.current || !buttonRef.current) return;
      const items = [
        buttonRef.current,
        ...Array.from(
          sheetRef.current.querySelectorAll<HTMLElement>("a, button"),
        ),
      ];
      const i = items.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        items[items.length - 1].focus();
      } else if (!e.shiftKey && i === items.length - 1) {
        e.preventDefault();
        items[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, buttonRef]);

  return (
    <div
      ref={sheetRef}
      id="mnav"
      className={clsx("mnav", menuOpen && "open")}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!menuOpen}
    >
      <div className="mnav-in">
        <ul className="mnav-list">
          {navItems.map((item, i) => (
            <li key={item.key}>
              <TransitionLink
                className="mnav-item"
                href={item.href}
                style={{ "--i": i } as React.CSSProperties}
                aria-current={current === item.key ? "page" : undefined}
                tabIndex={menuOpen ? undefined : -1}
                onMouseEnter={() => setHovered(item.key)}
                onFocus={() => setHovered(item.key)}
              >
                <span
                  className="lvl"
                  aria-hidden="true"
                  style={{ "--f": `${(i + 1) * 20}%` } as React.CSSProperties}
                >
                  <i />
                </span>
                <span className="mnav-txt">
                  <span className="mnav-mask">
                    <span className="mnav-t">{item.title}</span>
                  </span>
                  <span className="mnav-s">{item.sub}</span>
                </span>
              </TransitionLink>
            </li>
          ))}
        </ul>
        <div className="mnav-side">
          <div className="mnav-prev" aria-hidden="true">
            {navItems.map((item) => {
              const node = previews[item.key];
              const isTile = item.key === "case" || item.key === "about";
              return isTile ? (
                <div
                  key={item.key}
                  className={clsx(
                    "tp",
                    item.key === "about" && "ink",
                    preview === item.key && "on",
                  )}
                >
                  {node}
                </div>
              ) : (
                <div
                  key={item.key}
                  className={clsx("pv", preview === item.key && "on")}
                >
                  {node}
                </div>
              );
            })}
          </div>
          <div>
            <h4>Now</h4>
            <p>
              Forward deployed engineer at Teqar. Open to full-time FDE and
              full-stack roles.
            </p>
          </div>
          <div>
            <h4>Email</h4>
            <TransitionLink
              className="addr"
              href="/contact"
              tabIndex={menuOpen ? undefined : -1}
            >
              {siteConfig.email}
            </TransitionLink>
          </div>
          <div className="mnav-socials">
            <a
              className="btn btn-w"
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener"
              tabIndex={menuOpen ? undefined : -1}
            >
              <GithubLogo className="ico" aria-hidden="true" /> GitHub
            </a>
            <a
              className="btn btn-w"
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener"
              tabIndex={menuOpen ? undefined : -1}
            >
              <LinkedinLogo className="ico" aria-hidden="true" /> LinkedIn
            </a>
            <a
              className="btn btn-w"
              href={siteConfig.links.cv}
              target="_blank"
              rel="noopener"
              tabIndex={menuOpen ? undefined : -1}
            >
              <FileText className="ico" aria-hidden="true" /> CV
            </a>
            <a
              className="btn btn-w"
              href={siteConfig.links.collective}
              target="_blank"
              rel="noopener"
              tabIndex={menuOpen ? undefined : -1}
            >
              <MoonStars className="ico" aria-hidden="true" /> House of
              Imaginaries
            </a>
          </div>
        </div>
      </div>
      <span
        className="mnav-st ms-1"
        style={{ "--i": 0 } as React.CSSProperties}
        aria-hidden="true"
      />
      <span
        className="mnav-st ms-2"
        style={{ "--i": 1 } as React.CSSProperties}
        aria-hidden="true"
      />
      <span
        className="mnav-st ms-3"
        style={{ "--i": 2 } as React.CSSProperties}
        aria-hidden="true"
      />
    </div>
  );
}
