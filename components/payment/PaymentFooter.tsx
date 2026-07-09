"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { Plan } from "@/lib/plans";

type PaymentFooterProps = {
  plan: Plan;
  agreedRecurring: boolean;
  agreedTerms: boolean;
  onAgreedRecurringChange: (value: boolean) => void;
  onAgreedTermsChange: (value: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
};

export default function PaymentFooter({
  plan,
  agreedRecurring,
  agreedTerms,
  onAgreedRecurringChange,
  onAgreedTermsChange,
  onSubmit,
  isLoading,
}: PaymentFooterProps) {
  const canPay = agreedRecurring && agreedTerms && !isLoading;

  return (
    <div className="space-y-5 border-t border-hairline pt-6">
      <div className="space-y-3">
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={agreedRecurring}
            onChange={(e) => onAgreedRecurringChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline text-brand focus:ring-brand"
          />
          <span className="text-[13px] leading-relaxed text-ink2">정기결제에 동의합니다.</span>
        </label>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={agreedTerms}
            onChange={(e) => onAgreedTermsChange(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-hairline text-brand focus:ring-brand"
          />
          <span className="text-[13px] leading-relaxed text-ink2">이용약관에 동의합니다.</span>
        </label>
      </div>

      <button
        type="button"
        disabled={!canPay}
        onClick={onSubmit}
        className="group inline-flex h-[54px] w-full items-center justify-center gap-2.5 rounded-btn bg-brand text-[16px] font-semibold text-inverse shadow-[0_2px_12px_rgba(10,22,128,0.2)] transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_8px_24px_rgba(10,22,128,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[0_2px_12px_rgba(10,22,128,0.2)]"
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" strokeWidth={2} />
            결제 처리 중...
          </>
        ) : (
          <>
            {formatCurrency(plan.amount)} 결제하기
            <ArrowRight
              size={18}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </>
        )}
      </button>
    </div>
  );
}
