"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ArrowRight, Receipt } from "lucide-react";
import Badge from "@/components/common/Badge";
import FadeInSection from "@/components/landing/motion/FadeInSection";
import { useAuth } from "@/components/auth/AuthProvider";
import { useMockSession } from "@/components/auth/useMockSession";

type MessageRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: MessageRole;
  content: React.ReactNode;
};

const DEMO_RECEIPTS = [
  { merchant: "스타벅스 강남점", amount: "₩18,500", date: "3월 12일" },
  { merchant: "이마트24", amount: "₩32,000", date: "3월 10일" },
  { merchant: "카카오T 택시", amount: "₩12,400", date: "3월 8일" },
];

function BalanceReply() {
  const categories = [
    { label: "식비", amount: "₩120,000", color: "bg-chart-food" },
    { label: "행사비", amount: "₩210,000", color: "bg-chart-event" },
    { label: "교통비", amount: "₩91,000", color: "bg-chart-transport" },
  ];

  return (
    <div className="space-y-3">
      <p>
        현재 잔액은{" "}
        <span className="font-semibold text-navy">₩1,248,900</span> 입니다.
      </p>
      <p>
        이번 달 총 지출은{" "}
        <span className="font-semibold text-navy">₩421,000</span>입니다.
      </p>
      <div className="space-y-2 rounded-xl bg-white/60 p-3 ring-1 ring-hairline/60">
        {categories.map((cat) => (
          <div key={cat.label} className="flex items-center justify-between text-[13px]">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${cat.color}`} />
              <span className="text-ink2">{cat.label}</span>
            </div>
            <span className="font-medium text-navy">{cat.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReceiptReply() {
  return (
    <div className="space-y-3">
      <p>OCR로 등록된 영수증 3건을 찾았습니다.</p>
      <div className="space-y-2">
        {DEMO_RECEIPTS.map((receipt) => (
          <div
            key={receipt.merchant}
            className="flex items-center gap-3 rounded-xl bg-white/60 px-3 py-2.5 ring-1 ring-hairline/60"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-subtle text-brand">
              <Receipt className="h-3.5 w-3.5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-navy">
                {receipt.merchant}
              </p>
              <p className="text-[11px] text-muted">{receipt.date}</p>
            </div>
            <span className="shrink-0 text-[13px] font-semibold text-navy">
              {receipt.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const CONVERSATION_SCRIPT: Omit<ChatMessage, "id">[] = [
  { role: "user", content: "이번 달 회비 얼마나 남았어?" },
  { role: "assistant", content: <BalanceReply /> },
  { role: "user", content: "영수증도 보여줘." },
  { role: "assistant", content: <ReceiptReply /> },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-surface/80 px-4 py-3 ring-1 ring-hairline/50">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ role, children }: { role: MessageRole; children: React.ReactNode }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ring-1 ${
          isUser
            ? "bg-navy text-inverse ring-navy/20"
            : "bg-accent-subtle ring-accent/20"
        }`}
        aria-hidden
      >
        {isUser ? "👤" : "🐶"}
      </div>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
          isUser
            ? "bg-navy text-inverse"
            : "bg-white/80 text-ink2 shadow-[0_1px_4px_rgba(10,22,128,0.04)] ring-1 ring-hairline/60"
        }`}
      >
        {!isUser && (
          <p className="mb-1.5 text-[11px] font-semibold text-brand">돈독이</p>
        )}
        {children}
      </div>
    </motion.div>
  );
}

function ChatDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inView) return;

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const run = async () => {
      setMessages([]);
      setIsTyping(false);

      for (let i = 0; i < CONVERSATION_SCRIPT.length; i++) {
        if (cancelled) return;

        const step = CONVERSATION_SCRIPT[i];

        if (step.role === "assistant") {
          setIsTyping(true);
          await new Promise<void>((resolve) => {
            timeouts.push(setTimeout(resolve, 1400));
          });
          if (cancelled) return;
          setIsTyping(false);
        } else if (i > 0) {
          await new Promise<void>((resolve) => {
            timeouts.push(setTimeout(resolve, 600));
          });
          if (cancelled) return;
        }

        setMessages((prev) => [
          ...prev,
          { id: `msg-${i}`, role: step.role, content: step.content },
        ]);

        await new Promise<void>((resolve) => {
          timeouts.push(setTimeout(resolve, 400));
        });
      }
    };

    run();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [inView]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div ref={ref} className="relative">
      <div
        className="pointer-events-none absolute -inset-6 rounded-[32px] bg-[radial-gradient(ellipse_at_center,rgba(147,178,248,0.22)_0%,rgba(147,178,248,0)_70%)] blur-2xl"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-card border border-white/70 bg-white/60 shadow-[0_8px_40px_rgba(10,22,128,0.08)] backdrop-blur-2xl ring-1 ring-hairline/50">
        <div className="border-b border-hairline/60 bg-gradient-to-r from-brand-subtle/40 via-white/50 to-secondary-subtle/30 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-subtle text-lg ring-1 ring-accent/20">
              🐶
            </span>
            <div>
              <p className="text-[15px] font-semibold tracking-title-tight text-navy">
                돈독이
              </p>
              <p className="text-[12px] text-muted">AI 회계 어시스턴트</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              Online
            </span>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex max-h-[420px] min-h-[360px] flex-col gap-4 overflow-y-auto bg-gradient-to-b from-[#FCFDFF]/80 to-[#F3F6FC]/60 px-5 py-5"
        >
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} role={msg.role}>
                {msg.content}
              </ChatBubble>
            ))}
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex gap-2.5"
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-sm ring-1 ring-accent/20"
                  aria-hidden
                >
                  🐶
                </div>
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-hairline/60 bg-white/50 px-4 py-3.5 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-btn border border-hairline/70 bg-white/70 px-4 py-2.5 shadow-[inset_0_1px_2px_rgba(10,22,128,0.03)]">
            <span className="flex-1 text-[13px] text-muted">메시지를 입력하세요...</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-inverse opacity-40">
              <ArrowRight size={14} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIChatbotSection() {
  const router = useRouter();
  const { openAuth } = useAuth();
  const { session, hydrated } = useMockSession();
  const isLoggedIn = hydrated && Boolean(session?.isLoggedIn);

  const handleTryChatbot = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
      return;
    }
    openAuth("login");
  };

  return (
    <FadeInSection className="landing-section">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <Badge variant="accent" size="sm" className="mb-5">
            AI Assistant
          </Badge>
          <p className="dash-section-label">AI 회계 챗봇</p>
          <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.35rem)] font-bold leading-[1.2] tracking-title-tight text-navy">
            돈독이에게
            <br />
            무엇이든 물어보세요.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink2">
            회비 사용 내역, 잔액, 행사별 지출, 영수증, 예산 등을 자연어로 빠르게
            조회할 수 있습니다.
          </p>
          <button
            type="button"
            onClick={handleTryChatbot}
            className="group mt-8 inline-flex h-[52px] items-center justify-center gap-2.5 rounded-btn bg-brand px-7 text-[15px] font-semibold text-inverse shadow-[0_2px_10px_rgba(10,22,128,0.18)] transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_10px_28px_rgba(10,22,128,0.24)] active:translate-y-0"
          >
            챗봇 체험하기
            <ArrowRight
              size={17}
              strokeWidth={2}
              className="transition-transform duration-200 ease-premium group-hover:translate-x-1"
            />
          </button>
        </div>

        <ChatDemo />
      </div>
    </FadeInSection>
  );
}
