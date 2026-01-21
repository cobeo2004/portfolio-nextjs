"use client";

import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

type TProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Ask me about Simon...",
}: TProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const charCount = input.length;
  const maxChars = 500;

  return (
    <form onSubmit={handleSubmit} className="border-t border-muted/20 p-4">
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, maxChars))}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full resize-none rounded-lg bg-background/50 border border-muted/20 px-4 py-2 text-sm focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed max-h-32"
          />
          <span className="absolute bottom-1 right-2 text-xs text-muted">
            {charCount}/{maxChars}
          </span>
        </div>
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-accent text-background rounded-lg p-2 hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}
