"use client";

import { Copy } from "@phosphor-icons/react";
import { useRef } from "react";
import { toast } from "sonner";

export default function CopyEmail({ email }: { email: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const selectAddress = () => {
    if (!ref.current) return;
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    toast("Email selected. Press Cmd or Ctrl + C to copy.");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast("Email copied");
    } catch {
      selectAddress();
    }
  };

  return (
    <div className="mail">
      <span className="addr" ref={ref}>
        {email}
      </span>
      <button className="btn btn-inv !h-[46px]" type="button" onClick={copy}>
        <Copy className="ico" aria-hidden="true" /> Copy
      </button>
    </div>
  );
}
