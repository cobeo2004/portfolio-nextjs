"use client";

import Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { themeStore } from "@/lib/theme-store";
import type { TTheme } from "@/types";

type TSiteContext = {
  theme: TTheme;
  toggleTheme: () => void;
  wizard: boolean;
  setWizard: (on: boolean, quiet?: boolean) => void;
  wizardNote: boolean;
  hideWizardNote: () => void;
  askOpen: boolean;
  openAsk: () => void;
  closeAsk: () => void;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  navigate: (href: string) => void;
  scrollToTarget: (target: HTMLElement | number) => void;
};

export const SiteContext = createContext<TSiteContext | null>(null);

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function SiteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { choice, wizard, systemDark } = useSyncExternalStore(
    themeStore.subscribe,
    themeStore.getSnapshot,
    themeStore.getServerSnapshot,
  );
  const [wizardNote, setWizardNote] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const wiping = useRef(false);
  const firstPath = useRef(true);

  const theme: TTheme = wizard
    ? "wizard"
    : (choice ?? (systemDark ? "dark" : "light"));

  const setWizard = useCallback((on: boolean, quiet = false) => {
    themeStore.setWizard(on);
    setWizardNote(on && !quiet);
  }, []);

  const toggleTheme = useCallback(() => {
    if (wizard) setWizard(false);
    else themeStore.setChoice(theme === "light" ? "dark" : "light");
  }, [wizard, theme, setWizard]);

  // Smooth scrolling, driven by the GSAP ticker so ScrollTrigger stays in step.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Overlays freeze the page behind them.
  useEffect(() => {
    const locked = menuOpen || askOpen;
    document.documentElement.style.overflow = locked ? "hidden" : "";
    if (locked) lenisRef.current?.stop();
    else lenisRef.current?.start();
  }, [menuOpen, askOpen]);

  const scrollToTarget = useCallback((target: HTMLElement | number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, { offset: -20 });
      return;
    }
    const behavior = prefersReducedMotion() ? "auto" : "smooth";
    if (typeof target === "number") window.scrollTo({ top: target, behavior });
    else target.scrollIntoView({ behavior });
  }, []);

  // Page transitions: four stair columns cover the screen, the route changes, then they lift.
  const navigate = useCallback(
    (href: string) => {
      const go = () => {
        setAskOpen(false);
        setMenuOpen(false);
        if (href === pathname) {
          scrollToTarget(0);
          return;
        }
        const cols = wipeRef.current?.children;
        if (!cols || prefersReducedMotion()) {
          router.push(href);
          return;
        }
        wiping.current = true;
        gsap.set(cols, { transformOrigin: "50% 100%" });
        gsap.to(cols, {
          scaleY: 1,
          duration: 0.5,
          ease: "power3.inOut",
          stagger: 0.06,
          onComplete: () => router.push(href),
        });
      };
      // Let the menu sheet start closing before the columns rise.
      if (menuOpen && href !== pathname) {
        setMenuOpen(false);
        window.setTimeout(go, 180);
      } else go();
    },
    [pathname, router, menuOpen, scrollToTarget],
  );

  // A route change always closes the overlays.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setAskOpen(false);
  }

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    lenisRef.current?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const cols = wipeRef.current?.children;
    if (wiping.current && cols) {
      wiping.current = false;
      gsap.set(cols, { scaleY: 1, transformOrigin: "50% 0%" });
      gsap.to(cols, {
        scaleY: 0,
        duration: 0.6,
        ease: "power3.inOut",
        stagger: 0.06,
        delay: 0.05,
      });
    }
  }, [pathname]);

  // Buttons marked data-cmdk open the CV palette; same-page anchors scroll smoothly.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-cmdk]")) {
        e.preventDefault();
        setMenuOpen(false);
        setAskOpen(true);
        return;
      }
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
      const id = anchor?.getAttribute("href")?.slice(1);
      if (!anchor || !id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      setMenuOpen(false);
      scrollToTarget(el);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [scrollToTarget]);

  // Keyboard: Cmd/Ctrl+K for the palette, Escape to close, and two ways into wizard mode.
  const typed = useRef("");
  const konami = useRef(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setMenuOpen(false);
        setAskOpen((open) => !open);
        return;
      }
      if (e.key === "Escape") {
        if (askOpen) setAskOpen(false);
        else if (menuOpen) setMenuOpen(false);
        else if (wizardNote) setWizardNote(false);
        return;
      }
      if ((e.target as HTMLElement | null)?.closest("input, textarea")) return;
      konami.current =
        e.key === KONAMI[konami.current]
          ? konami.current + 1
          : e.key === KONAMI[0]
            ? 1
            : 0;
      if (konami.current === KONAMI.length) {
        konami.current = 0;
        setWizard(!wizard);
      }
      if (e.key.length === 1) {
        typed.current = (typed.current + e.key.toLowerCase()).slice(-5);
        if (typed.current === "accio") {
          typed.current = "";
          setWizard(!wizard);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [askOpen, menuOpen, wizardNote, wizard, setWizard]);

  const value = useMemo<TSiteContext>(
    () => ({
      theme,
      toggleTheme,
      wizard,
      setWizard,
      wizardNote,
      hideWizardNote: () => setWizardNote(false),
      askOpen,
      openAsk: () => {
        setMenuOpen(false);
        setAskOpen(true);
      },
      closeAsk: () => setAskOpen(false),
      menuOpen,
      setMenuOpen,
      navigate,
      scrollToTarget,
    }),
    [
      theme,
      toggleTheme,
      wizard,
      setWizard,
      wizardNote,
      askOpen,
      menuOpen,
      navigate,
      scrollToTarget,
    ],
  );

  return (
    <SiteContext.Provider value={value}>
      <div className="wipe" ref={wipeRef} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      {children}
    </SiteContext.Provider>
  );
}
