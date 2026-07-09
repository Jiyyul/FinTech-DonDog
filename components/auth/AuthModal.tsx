"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthTabs from "@/components/auth/AuthTabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function AuthModal() {
  const { isOpen, tab, closeAuth, setTab, showToast } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const modal = modalRef.current;
    const focusable = modal?.querySelectorAll<HTMLElement>(FOCUSABLE);
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAuth();
        return;
      }
      if (e.key !== "Tab" || !focusable?.length) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeAuth, tab]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="닫기"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-[10px]"
            onClick={closeAuth}
          />

          <div className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="auth-modal-title"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-[460px] overflow-hidden rounded-card border border-hairline bg-card p-8 shadow-[0_24px_60px_rgba(10,22,128,0.14)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/logo/dondog-logo.png"
                    alt="Don Dog"
                    width={453}
                    height={428}
                    className="h-8 w-auto object-contain"
                  />
                  <p id="auth-modal-title" className="text-[17px] font-bold tracking-title-tight text-navy">
                    돈독
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeAuth}
                  className="ui-icon-btn -mr-1 -mt-1"
                  aria-label="닫기"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <AuthTabs tab={tab} onChange={setTab} />

              <div className="mt-6 max-h-[min(68vh,560px)] overflow-y-auto pr-0.5">
                {tab === "login" ? (
                  <LoginForm
                    onSwitchToSignup={() => setTab("signup")}
                    onSuccess={closeAuth}
                  />
                ) : (
                  <SignupForm
                    onSwitchToLogin={() => setTab("login")}
                    onSignupComplete={() => {
                      showToast("회원가입이 완료되었습니다.");
                      setTab("login");
                    }}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
