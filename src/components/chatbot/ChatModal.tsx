"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import type { TChatMessage } from "@/types";

type TProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ChatModal({ isOpen, onClose }: TProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<TChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm here to help answer questions about Simon's professional background, skills, and experience. What would you like to know?",
      createdAt: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    const userMessage: TChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to get response");
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      // Add placeholder assistant message
      const assistantMessage: TChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      // Stream response
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;

          // Update assistant message with accumulated content
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: assistantContent,
            };
            return updated;
          });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      // Remove the placeholder message if there was an error
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.content === "") {
          updated.pop();
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 right-4 w-[400px] h-[600px] bg-background border border-muted/20 rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-accent text-background px-4 py-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Chat with Simon&apos;s AI</h3>
                <p className="text-xs opacity-80">Ask me anything about Simon</p>
              </div>
              <button
                onClick={onClose}
                className="hover:opacity-80 transition-opacity"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={{
                    id: msg.id,
                    role: msg.role as "user" | "assistant",
                    content: msg.content,
                    createdAt: msg.createdAt || new Date(),
                  }}
                />
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-muted">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 text-red-500 rounded-lg px-4 py-2 text-sm">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={handleSend} disabled={isLoading} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
