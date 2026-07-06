"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import {
  AI_CHAT_SUGGESTIONS,
  AI_CHAT_RESPONSES,
} from "@/lib/dashboard-mock-data";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export default function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: text.trim(),
    };

    const response =
      AI_CHAT_RESPONSES[text.trim()] ??
      "🐶 요청하신 내용을 확인했어요. 관련 거래를 대시보드에서 검토해 보세요.";

    const assistantMsg: Message = {
      id: `a-${Date.now()}`,
      role: "assistant",
      text: response,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[55] bg-black/8 backdrop-blur-[1px]"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="fixed bottom-6 right-6 z-[60] flex max-w-[calc(100vw-1.5rem)] flex-col items-end gap-3">
        {open && (
          <div className="flex w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open">
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-subtle text-sm ring-1 ring-accent/20">
                  🐶
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-navy">Don Dog AI</p>
                  <p className="text-[11px] text-muted">회계 비서</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ui-icon-btn"
                aria-label="채팅 닫기"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex max-h-[300px] min-h-[180px] flex-1 flex-col gap-2.5 overflow-y-auto px-5 py-4">
              {messages.length === 0 && (
                <p className="py-6 text-center text-[13px] text-muted">
                  무엇이든 물어보세요
                </p>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    msg.role === "user"
                      ? "ml-auto bg-navy text-inverse"
                      : "mr-auto bg-surface text-ink2"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="border-t border-hairline px-4 py-3">
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {AI_CHAT_SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => sendMessage(q)}
                    className="rounded-full bg-surface px-2.5 py-1 text-[11px] text-ink2 transition-colors duration-200 hover:ring-1 hover:ring-hairline hover:text-ink"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="메시지를 입력하세요"
                  className="h-10 flex-1 rounded-btn border border-hairline bg-card px-3.5 text-[13px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(196,255,77,0.2)]"
                />
                <button
                  type="submit"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-brand text-ink transition-transform duration-200 hover:scale-[1.03] hover:brightness-95"
                  aria-label="전송"
                >
                  <Send size={16} strokeWidth={1.5} />
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-lg shadow-card transition-all duration-300 ease-premium hover:scale-[1.04] hover:brightness-95 hover:shadow-card-hover"
          aria-label="AI 채팅 열기"
          aria-expanded={open}
        >
          {open ? (
            <X size={20} className="text-ink" strokeWidth={1.75} />
          ) : (
            <span aria-hidden>🐶</span>
          )}
        </button>
      </div>
    </>
  );
}
