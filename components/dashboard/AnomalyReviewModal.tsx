"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import AIMessage from "@/components/common/AIMessage";
import StatusBadge from "@/components/common/StatusBadge";
import { formatCurrency } from "@/lib/format";
import {
  ANOMALY_TYPE_LABELS,
  type AuditAnomaly,
  type BudgetCategory,
} from "@/lib/dashboard-types";

type AnomalyReviewModalProps = {
  open: boolean;
  anomaly: AuditAnomaly | null;
  onClose: () => void;
  onApprove: () => void;
  onException: () => void;
  onDefer: () => void;
  onRequestCoApproval?: () => void;
  onCategoryChange?: (category: BudgetCategory) => void;
};

const CATEGORIES: BudgetCategory[] = [
  "행사비",
  "식비",
  "운영비",
  "교통비",
  "장비비",
  "기타",
];

export default function AnomalyReviewModal({
  open,
  anomaly,
  onClose,
  onApprove,
  onException,
  onDefer,
  onRequestCoApproval,
  onCategoryChange,
}: AnomalyReviewModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !anomaly) return null;

  const tx = anomaly.transaction;
  const isAmountThreshold = anomaly.type === "amount_threshold";
  const isLowConfidence = anomaly.type === "low_confidence";

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[70] flex max-h-[90vh] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="anomaly-review-title"
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-label-wide text-muted">
              AI 이상감지
            </p>
            <h2
              id="anomaly-review-title"
              className="mt-0.5 text-[18px] font-semibold tracking-title-tight text-navy"
            >
              {ANOMALY_TYPE_LABELS[anomaly.type]}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[28px] font-semibold tracking-title-tight text-navy tabular-nums">
                {formatCurrency(tx.amount)}
              </p>
              <p className="mt-1 text-[15px] font-medium text-ink">{tx.merchant}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={tx.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-6">
            <InfoField label="AI 분류" value={tx.category} />
            <InfoField label="날짜" value={tx.dateLabel} />
            {anomaly.relatedSchedule && (
              <InfoField label="관련 일정" value={anomaly.relatedSchedule} />
            )}
            {tx.paymentMethod && (
              <InfoField label="결제수단" value={tx.paymentMethod} />
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-warning/20 bg-warning/5 p-5">
            <p className="text-[13px] font-semibold text-ink">이상 사유</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink2">{anomaly.reason}</p>
            {anomaly.ruleReference && (
              <p className="mt-3 text-[12px] text-muted">회칙: {anomaly.ruleReference}</p>
            )}
          </div>

          <div className="mt-4 rounded-2xl bg-surface p-4 ring-1 ring-hairline">
            <AIMessage>{tx.category}로 분류했어요.</AIMessage>
          </div>

          {isLowConfidence && onCategoryChange && (
            <div className="mt-4">
              <label className="mb-1.5 block text-[13px] text-muted">카테고리 변경</label>
              <select
                value={tx.category}
                onChange={(e) => onCategoryChange(e.target.value as BudgetCategory)}
                className="h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2.5 border-t border-hairline px-6 py-4">
          {isAmountThreshold ? (
            <>
              <Button variant="primary" className="min-w-[8rem] flex-1" onClick={onRequestCoApproval}>
                공동 승인 요청
              </Button>
              <Button variant="secondary" className="min-w-[8rem] flex-1" onClick={onApprove}>
                문제없음 승인
              </Button>
              <Button variant="ghost" className="min-w-[4rem] px-4 text-[13px]" onClick={onDefer}>
                보류
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" className="min-w-[8rem] flex-1" onClick={onApprove}>
                승인
              </Button>
              <Button variant="secondary" className="min-w-[8rem] flex-1" onClick={onException}>
                예외 처리
              </Button>
              <Button variant="ghost" className="min-w-[4rem] px-4 text-[13px]" onClick={onDefer}>
                보류
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1 text-[15px] font-semibold text-ink">{value}</p>
    </div>
  );
}
