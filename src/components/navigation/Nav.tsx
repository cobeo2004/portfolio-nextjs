"use client";

import { Moon, Sparkle, Sun } from "@phosphor-icons/react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Mark from "@/components/icons/Mark";
import { useSite } from "@/hooks/useSite";
import { navItems } from "@/lib/data";
import MenuSheet from "./MenuSheet";
import TransitionLink from "./TransitionLink";
import { pageKey } from "./pageKey";

// Header after Lead the Way: transparent at the top, a floating glass bar once the page moves,
// hidden while reading down and back as soon as you scroll up.
export default function Nav() {
  const { theme, toggleTheme, menuOpen, setMenuOpen } = useSite();
  const pathname = usePathname();
  const current = pageKey(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const progRef = useRef<HTMLSpanElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 24);
      if (y > 320 && y > lastY.current + 2) setHidden(true);
      if (y < lastY.current - 2) setHidden(false);
      lastY.current = y;
      if (progRef.current)
        progRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const next = theme === "light" ? "dark" : "light";
  const glass = scrolled || current === "contact";

  return (
    <>
      <header
        className={clsx(
          "nav",
          glass && "glass",
          hidden && !menuOpen && "hide",
          menuOpen && "nav-open",
        )}
      >
        <div className="nav-bar">
          <TransitionLink
            className="brand"
            href="/"
            aria-label="Simon Nguyen, home"
          >
            <Mark />
            Simon Nguyen
          </TransitionLink>
          <nav className="nav-links" aria-label="Pages">
            {navItems
              .filter((item) => ["work", "about", "contact"].includes(item.key))
              .map((item) => (
                <TransitionLink
                  key={item.key}
                  href={item.href}
                  aria-current={current === item.key ? "page" : undefined}
                >
                  {item.title}
                </TransitionLink>
              ))}
          </nav>
          <div className="nav-end">
            <button className="pill" type="button" data-cmdk>
              <Sparkle className="ico" aria-hidden="true" />
              <span className="lbl">Ask my CV</span>
              <kbd>⌘K</kbd>
            </button>
            <button
              className="sq"
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${next} theme`}
            >
              {next === "light" ? (
                <Sun className="ico" aria-hidden="true" />
              ) : (
                <Moon className="ico" aria-hidden="true" />
              )}
            </button>
            <button
              ref={menuBtnRef}
              className="menu-btn"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mnav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span className="lbl">{menuOpen ? "Close" : "Menu"}</span>
              <span className="bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
          <span className="nav-prog" ref={progRef} aria-hidden="true" />
        </div>
      </header>
      <MenuSheet buttonRef={menuBtnRef} current={current} />
    </>
  );
}
