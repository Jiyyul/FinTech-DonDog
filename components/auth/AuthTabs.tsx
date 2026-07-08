"use client";

import { motion } from "framer-motion";
import type { AuthTab } from "@/components/auth/AuthProvider";

type AuthTabsProps = {
  tab: AuthTab;
  onChange: (tab: AuthTab) => void;
};

const TABS: { id: AuthTab; label: string }[] = [
  { id: "login", label: "로그인" },
  { id: "signup", label: "회원가입" },
];

export default function AuthTabs({ tab, onChange }: AuthTabsProps) {
  return (
    <div className="relative flex border-b border-hairline" role="tablist">
      {TABS.map((item) => {
        const isActive = tab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={`relative flex-1 pb-3 pt-1 text-[15px] font-semibold transition-colors duration-200 ${
              isActive ? "text-brand" : "text-muted hover:text-ink2"
            }`}
          >
            {item.label}
            {isActive && (
              <motion.span
                layoutId="auth-tab-indicator"
                className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-brand"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
