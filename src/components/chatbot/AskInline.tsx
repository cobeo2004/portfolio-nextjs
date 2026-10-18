"use client";

import clsx from "clsx";
import { useAskCV } from "@/hooks/useAskCV";
import { suggestedQuestions } from "@/lib/data";

// The contact page version of Ask my CV: one tap on a question streams the answer in place.
export default function AskInline() {
  const { answer, status, note, ask } = useAskCV();

  return (
    <div className="ask-inline" data-rise>
      <h3>Ask my CV</h3>
      <div className="chips">
        {suggestedQuestions.map((s) => (
          <button
            key={s.question}
            className="chip"
            type="button"
            onClick={() => ask(s.question, s.fallback)}
          >
            {s.question}
          </button>
        ))}
      </div>
      <div
        className={clsx("ansbox", status === "streaming" && "caret")}
        aria-live="polite"
      >
        {status === "idle"
          ? "Pick a question. Answers come from my CV."
          : answer}
      </div>
      {note && <p className="ask-note">{note}</p>}
    </div>
  );
}
