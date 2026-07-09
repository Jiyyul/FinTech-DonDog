"use client";

import { Check } from "lucide-react";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { PLANS_LIST } from "@/lib/plans";
import { formatPlanPrice } from "@/lib/plans";

type SignupPlanPickerProps = {
  selectedPlanId: string | null;
  onSelect: (planId: string) => void;
  onConfirm: () => void;
  onBack: () => void;
  canConfirm: boolean;
};

export default function SignupPlanPicker({
  selectedPlanId,
  onSelect,
  onConfirm,
  onBack,
  canConfirm,
}: SignupPlanPickerProps) {
  const selectedPlan = PLANS_LIST.find((plan) => plan.id === selectedPlanId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-navy">요금제 선택</p>
          <p className="mt-1 text-[12px] text-muted">동아리에 맞는 플랜을 선택하세요.</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="shrink-0 text-[13px] font-medium text-brand transition-colors hover:text-brand-hover"
        >
          돌아가기
        </button>
      </div>

      <div className="space-y-2.5">
        {PLANS_LIST.map((plan) => {
          const isSelected = selectedPlanId === plan.id;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelect(plan.id)}
              className={`w-full rounded-2xl border p-4 text-left transition-all duration-200 ${
                isSelected
                  ? "border-brand bg-brand-subtle/40 ring-2 ring-brand/20"
                  : "border-hairline bg-card hover:border-brand/30 hover:bg-surface"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-semibold text-navy">{plan.name}</p>
                    {plan.featured && (
                      <Badge variant="accent" className="text-[10px]">
                        추천
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] text-ink2">{plan.description}</p>
                  <p className="mt-2 text-[14px] font-bold text-navy">{formatPlanPrice(plan)}</p>
                  <p className="mt-1 text-[12px] text-muted">조직 관리 {plan.organizationLimit}</p>
                  <ul className="mt-3 space-y-1.5">
                    {plan.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-[12px] text-ink2"
                      >
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    isSelected ? "border-brand bg-brand text-inverse" : "border-hairline bg-card"
                  }`}
                  aria-hidden
                >
                  {isSelected && <Check size={12} strokeWidth={2.5} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        variant="primary"
        className="w-full"
        disabled={!canConfirm || !selectedPlanId}
        onClick={onConfirm}
      >
        {selectedPlan ? `${selectedPlan.name} 플랜으로 가입하기` : "플랜을 선택해주세요"}
      </Button>

      {!canConfirm && (
        <p className="text-center text-[12px] text-muted">
          이름, 이메일, 비밀번호를 입력하고 약관에 동의해주세요.
        </p>
      )}
    </div>
  );
}
