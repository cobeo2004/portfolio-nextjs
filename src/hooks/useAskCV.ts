import { useCallback, useEffect, useRef, useState } from "react";
import type { TChatMessage } from "@/types";

type TAskStatus = "idle" | "streaming" | "done" | "error";

const makeMessage = (
  role: TChatMessage["role"],
  content: string,
): TChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  createdAt: new Date(),
});

// Streams an answer from /api/chat (RAG over the CV). Earlier turns are sent along so follow-ups
// make sense. Suggested questions carry a prewritten fallback for when the endpoint is busy.
export const useAskCV = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<TAskStatus>("idle");
  const [note, setNote] = useState("");
  const history = useRef<TChatMessage[]>([]);
  const controller = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
  }, []);

  const reset = useCallback(() => {
    cancel();
    setQuestion("");
    setAnswer("");
    setNote("");
    setStatus("idle");
  }, [cancel]);

  const ask = useCallback(
    async (q: string, fallback?: string) => {
      cancel();
      const ac = new AbortController();
      controller.current = ac;
      setQuestion(q);
      setAnswer("");
      setNote("");
      setStatus("streaming");

      const messages = [...history.current.slice(-6), makeMessage("user", q)];
      let text = "";
      try {
        const resp = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages }),
          // Give up after 20 s so a cold or busy endpoint falls back instead of hanging.
          signal: AbortSignal.any([ac.signal, AbortSignal.timeout(20000)]),
        });
        if (!resp.ok || !resp.body) {
          const data = await resp.json().catch(() => null);
          throw new Error(data?.error ?? "The CV assistant is unavailable.");
        }
        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setAnswer(text);
        }
        history.current = [...messages, makeMessage("assistant", text)];
        setStatus("done");
      } catch (err) {
        if (ac.signal.aborted) return;
        if (fallback) {
          setAnswer(fallback);
          setNote(
            "Live answers are busy right now, so this one is prewritten from my CV.",
          );
          setStatus("done");
        } else {
          setAnswer(
            err instanceof Error
              ? err.message
              : "The CV assistant is unavailable.",
          );
          setNote("Try one of the suggested questions, or email me instead.");
          setStatus("error");
        }
      } finally {
        if (controller.current === ac) controller.current = null;
      }
    },
    [cancel],
  );

  useEffect(() => cancel, [cancel]);

  return { question, answer, status, note, ask, reset };
};
