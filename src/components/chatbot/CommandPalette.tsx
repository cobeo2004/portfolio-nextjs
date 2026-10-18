"use client";

import {
  ArrowRight,
  Hash,
  MagnifyingGlass,
  Sparkle,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useAskCV } from "@/hooks/useAskCV";
import { useSite } from "@/hooks/useSite";
import { suggestedQuestions } from "@/lib/data";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type TItem =
  | { kind: "ask"; label: string; fallback?: string }
  | { kind: "jump"; label: string; href: string };

const jumps = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Syncnapse case study", href: "/work/syncnapse" },
  { label: "About and experience", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Cmd/Ctrl+K: ask the CV assistant (streamed from /api/chat) or jump to a page.
export default function CommandPalette() {
  const { askOpen, closeAsk, navigate } = useSite();
  const { question, answer, status, note, ask, reset } = useAskCV();
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState("");
  const [sel, setSel] = useState(0);
  const [answering, setAnswering] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const items = useMemo<TItem[]>(() => {
    const q = query.toLowerCase().trim();
    const asks: TItem[] = suggestedQuestions
      .filter((s) => !q || s.question.toLowerCase().includes(q))
      .map((s) => ({ kind: "ask", label: s.question, fallback: s.fallback }));
    const go: TItem[] = jumps
      .filter((j) => !q || j.label.toLowerCase().includes(q))
      .map((j) => ({ kind: "jump", ...j }));
    if (q && !asks.length) asks.push({ kind: "ask", label: query.trim() });
    return [...asks, ...go];
  }, [query]);

  // Open and close with the drop-in and the solid shadow that snaps on after it lands.
  useEffect(() => {
    const reduce = prefersReducedMotion();
    if (askOpen) {
      lastFocus.current = document.activeElement as HTMLElement | null;
      setVisible(true);
      setQuery("");
      setSel(0);
      setAnswering(false);
      reset();
      return;
    }
    if (!visible) return;
    lastFocus.current?.focus?.();
    if (reduce || !rootRef.current || !boxRef.current) {
      setVisible(false);
      return;
    }
    gsap.killTweensOf([rootRef.current, boxRef.current]);
    gsap.to(boxRef.current, {
      y: -14,
      scale: 0.97,
      opacity: 0,
      boxShadow: "0px 0px 0 var(--ink)",
      duration: 0.22,
      ease: "power2.in",
    });
    gsap.to(rootRef.current, {
      opacity: 0,
      duration: 0.26,
      ease: "power1.in",
      onComplete: () => {
        gsap.set([rootRef.current, boxRef.current], { clearProps: "all" });
        setVisible(false);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askOpen]);

  useLayoutEffect(() => {
    if (!visible || !askOpen) return;
    window.setTimeout(() => inputRef.current?.focus(), 20);
    if (prefersReducedMotion() || !rootRef.current || !boxRef.current) return;
    gsap.killTweensOf([rootRef.current, boxRef.current]);
    gsap.fromTo(
      rootRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "power1.out" },
    );
    gsap.fromTo(
      boxRef.current,
      { y: -28, scale: 0.96, opacity: 0, boxShadow: "0px 0px 0 var(--ink)" },
      { y: 0, scale: 1, opacity: 1, duration: 0.55, ease: "expo.out" },
    );
    gsap.to(boxRef.current, {
      boxShadow: "12px 12px 0 var(--ink)",
      duration: 0.35,
      ease: "back.out(2.5)",
      delay: 0.22,
    });
  }, [visible, askOpen]);

  // List rows cascade in whenever the results change.
  useLayoutEffect(() => {
    if (!visible || prefersReducedMotion() || !listRef.current) return;
    gsap.from(listRef.current.children, {
      y: 10,
      opacity: 0,
      duration: 0.4,
      ease: "expo.out",
      stagger: 0.028,
      overwrite: true,
    });
  }, [visible, items, answering]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [sel]);

  const run = (item: TItem) => {
    if (item.kind === "jump") {
      closeAsk();
      window.setTimeout(
        () => navigate(item.href),
        prefersReducedMotion() ? 0 : 200,
      );
      return;
    }
    setAnswering(true);
    ask(item.label, item.fallback);
  };

  const askItems = items.filter((i) => i.kind === "ask");
  const jumpItems = items.filter((i) => i.kind === "jump");

  return (
    <div
      ref={rootRef}
      className="cmdk"
      hidden={!visible}
      role="dialog"
      aria-modal="true"
      aria-label="Ask my CV and jump to"
      onClick={(e) => e.target === e.currentTarget && closeAsk()}
    >
      <div className="cmdk-box" ref={boxRef}>
        <div className="cmdk-in">
          <MagnifyingGlass className="ico" aria-hidden="true" />
          <label className="sr" htmlFor="cmdkInput">
            Ask a question or jump to a section
          </label>
          <input
            ref={inputRef}
            id="cmdkInput"
            placeholder="Ask my CV, or jump to a section"
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSel(0);
              setAnswering(false);
            }}
            onKeyDown={(e) => {
              if (answering) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setSel((s) => Math.min(items.length - 1, s + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSel((s) => Math.max(0, s - 1));
              } else if (e.key === "Enter" && items[sel]) {
                e.preventDefault();
                run(items[sel]);
              }
            }}
          />
          <kbd>esc</kbd>
        </div>
        <div
          className="cmdk-list"
          ref={listRef}
          role={answering ? undefined : "listbox"}
          aria-label="Suggestions"
        >
          {answering ? (
            <div className="ans" aria-live="polite">
              <div className="q">{question}</div>
              <div className={clsx("a", status === "streaming" && "caret")}>
                {answer || (status === "streaming" ? "" : " ")}
              </div>
              <div className="note">
                {note ||
                  "Answers come from my CV through a small RAG endpoint."}
              </div>
              <button
                className="ci"
                type="button"
                onClick={() => {
                  setAnswering(false);
                  inputRef.current?.focus();
                }}
              >
                <ArrowRight className="ico" aria-hidden="true" />
                Ask something else
              </button>
            </div>
          ) : (
            <>
              {askItems.length > 0 && <h5>Ask my CV</h5>}
              {askItems.map((item) => {
                const i = items.indexOf(item);
                const free = !item.fallback;
                return (
                  <button
                    key={`a-${item.label}`}
                    className="ci"
                    type="button"
                    role="option"
                    aria-selected={i === sel}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => run(item)}
                  >
                    <Sparkle className="ico" aria-hidden="true" />
                    {free ? `Ask: ${item.label}` : item.label}
                  </button>
                );
              })}
              {jumpItems.length > 0 && <h5>Go to</h5>}
              {jumpItems.map((item) => {
                const i = items.indexOf(item);
                return (
                  <button
                    key={`j-${item.label}`}
                    className="ci"
                    type="button"
                    role="option"
                    aria-selected={i === sel}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => run(item)}
                  >
                    <Hash className="ico" aria-hidden="true" />
                    {item.label}
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
