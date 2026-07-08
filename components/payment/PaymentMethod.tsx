"use client";

import { CreditCard } from "lucide-react";
import type { PaymentMethodId } from "@/components/payment/payment-types";

type PaymentMethodOption = {
  id: PaymentMethodId;
  label: string;
  badge?: string;
};

const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: "card", label: "신용카드" },
  { id: "kakao", label: "카카오페이", badge: "Pay" },
  { id: "toss", label: "토스페이" },
  { id: "naver", label: "네이버페이" },
];

type PaymentMethodProps = {
  value: PaymentMethodId;
  onChange: (method: PaymentMethodId) => void;
};

export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <div>
      <h4 className="text-[15px] font-semibold text-navy">결제수단</h4>
      <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
        {PAYMENT_METHODS.map((method) => {
          const selected = value === method.id;

          return (
            <label
              key={method.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200 ${
                selected
                  ? "border-brand bg-brand-subtle/40 ring-1 ring-brand/20"
                  : "border-hairline bg-card hover:border-brand/25 hover:bg-surface"
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={method.id}
                checked={selected}
                onChange={() => onChange(method.id)}
                className="h-4 w-4 shrink-0 border-hairline text-brand focus:ring-brand"
              />
              {method.id === "card" ? (
                <CreditCard size={18} className="shrink-0 text-ink2" strokeWidth={1.5} />
              ) : (
                <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md bg-surface text-[9px] font-bold text-brand ring-1 ring-hairline">
                  {method.badge ?? method.label.slice(0, 1)}
                </span>
              )}
              <span className="text-[14px] font-medium text-ink">{method.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
