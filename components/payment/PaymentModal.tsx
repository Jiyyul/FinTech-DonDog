"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import CouponInput from "@/components/payment/CouponInput";
import PaymentDetail from "@/components/payment/PaymentDetail";
import PaymentFooter from "@/components/payment/PaymentFooter";
import PaymentMethod from "@/components/payment/PaymentMethod";
import PlanSummary from "@/components/payment/PlanSummary";
import { usePayment } from "@/components/payment/PaymentProvider";
import type { PaymentMethodId } from "@/components/payment/payment-types";
import { PAYMENT_PLANS } from "@/lib/payment-data";

function formatKoreanDate(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function PaymentModal() {
  const { isOpen, planId, closePayment, showToast } = usePayment();
  const modalRef = useRef<HTMLDivElement>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("card");
  const [agreedRecurring, setAgreedRecurring] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const plan = planId ? PAYMENT_PLANS[planId] : null;

  const { firstPaymentLabel, nextPaymentLabel } = useMemo(() => {
    const today = new Date();
    const next = new Date(today);
    next.setMonth(next.getMonth() + 1);
    return {
      firstPaymentLabel: formatKoreanDate(today),
      nextPaymentLabel: formatKoreanDate(next),
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setPaymentMethod("card");
      setAgreedRecurring(false);
      setAgreedTerms(false);
      setIsLoading(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) closePayment();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, closePayment]);

  const handleSubmit = async () => {
    if (!plan || isLoading) return;

    setIsLoading(true);

    // TODO: Payment API 연결 — 토스페이먼츠 / PortOne 결제 요청
    await new Promise((resolve) => window.setTimeout(resolve, 2000));

    setIsLoading(false);
    showToast("결제 기능은 개발 중입니다.");
  };

  if (typeof document === "undefined" || !plan) return null;

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
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-[10px]"
            onClick={() => !isLoading && closePayment()}
          />

          <div className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="payment-modal-title"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex max-h-[min(92vh,880px)] w-full max-w-[760px] flex-col overflow-hidden rounded-card border border-hairline bg-card shadow-[0_24px_60px_rgba(10,22,128,0.14)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between border-b border-hairline px-6 py-5 sm:px-8">
                <div>
                  <p className="dash-section-label">플랜 결제</p>
                  <h2
                    id="payment-modal-title"
                    className="mt-1 text-[18px] font-bold tracking-title-tight text-navy"
                  >
                    {plan.productName} 구독
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => !isLoading && closePayment()}
                  className="ui-icon-btn"
                  aria-label="닫기"
                  disabled={isLoading}
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
                  <PlanSummary plan={plan} />

                  <div className="space-y-6">
                    <PaymentDetail
                      plan={plan}
                      firstPaymentLabel={firstPaymentLabel}
                      nextPaymentLabel={nextPaymentLabel}
                    />
                    <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
                    <CouponInput />
                    <PaymentFooter
                      plan={plan}
                      agreedRecurring={agreedRecurring}
                      agreedTerms={agreedTerms}
                      onAgreedRecurringChange={setAgreedRecurring}
                      onAgreedTermsChange={setAgreedTerms}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
