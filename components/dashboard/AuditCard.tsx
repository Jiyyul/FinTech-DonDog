"use client";

import { useEffect, useState } from "react";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { ChevronLeft, ChevronRight, Clock, Send } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { ANOMALY_TYPE_LABELS, type AuditAnomaly } from "@/lib/dashboard-types";

type AuditCardProps = {
  anomalies: AuditAnomaly[];
  deferredAnomalies: AuditAnomaly[];
  pendingCoApprovals?: AuditAnomaly[];
  onReview: (anomaly: AuditAnomaly) => void;
  onReviewDeferred?: (anomaly: AuditAnomaly) => void;
  onReviewPendingCoApproval?: (anomaly: AuditAnomaly) => void;
  className?: string;
};

export default function AuditCard({
  anomalies,
  deferredAnomalies,
  pendingCoApprovals = [],
  onReview,
  onReviewDeferred,
  onReviewPendingCoApproval,
  className = "",
}: AuditCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCount =
    anomalies.length + deferredAnomalies.length + pendingCoApprovals.length;

  useEffect(() => {
    setCurrentIndex((prev) => {
      if (anomalies.length === 0) return 0;
      return Math.min(prev, anomalies.length - 1);
    });
  }, [anomalies.length]);

  const current = anomalies[currentIndex];
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < anomalies.length - 1;

  const goPrev = () => {
    if (canGoPrev) setCurrentIndex((prev) => prev - 1);
  };

  const goNext = () => {
    if (canGoNext) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <Card className={`flex min-w-0 flex-col ${className}`}>
      <div className="mb-5 flex shrink-0 items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-subtle text-sm ring-1 ring-accent/20"
            aria-hidden
          >
            🐶
          </span>
          <h3 className="dash-card-title min-w-0">AI 이상감지</h3>
        </div>
        {totalCount > 0 && (
          <Badge variant="warning" size="sm" className="uppercase tracking-label-wide">
            {totalCount}건
          </Badge>
        )}
      </div>

      {pendingCoApprovals.length > 0 && (
        <div className="mb-4 shrink-0 rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3 ring-1 ring-brand/10">
          <div className="flex items-center gap-2">
            <Send size={15} className="shrink-0 text-brand" strokeWidth={1.75} />
            <p className="text-[13px] font-semibold text-brand">승인 요청 중</p>
            <Badge variant="info" size="sm" className="ml-auto">
              {pendingCoApprovals.length}건
            </Badge>
          </div>
          <ul className="mt-2 space-y-1">
            {pendingCoApprovals.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onReviewPendingCoApproval?.(item)}
                  className="flex w-full items-center justify-between rounded-lg px-1 py-0.5 text-left transition-colors duration-200 hover:bg-brand/10"
                >
                  <span className="truncate text-[12px] font-medium text-ink">
                    {item.transaction.merchant}
                  </span>
                  <span className="ml-2 shrink-0 text-[12px] tabular-nums text-ink2">
                    {formatCurrency(item.transaction.amount)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {deferredAnomalies.length > 0 && (
        <div className="mb-4 shrink-0 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 ring-1 ring-warning/10">
          <div className="flex items-center gap-2">
            <Clock size={15} className="shrink-0 text-warning" strokeWidth={1.75} />
            <p className="text-[13px] font-semibold text-warning">보류된 거래</p>
            <Badge variant="warning" size="sm" className="ml-auto">
              {deferredAnomalies.length}건
            </Badge>
          </div>
          <ul className="mt-2 space-y-1">
            {deferredAnomalies.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onReviewDeferred?.(item)}
                  className="flex w-full items-center justify-between rounded-lg px-1 py-0.5 text-left transition-colors duration-200 hover:bg-warning/10"
                >
                  <span className="truncate text-[12px] font-medium text-ink">
                    {item.transaction.merchant}
                  </span>
                  <span className="ml-2 shrink-0 text-[12px] tabular-nums text-ink2">
                    {formatCurrency(item.transaction.amount)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <div className="flex items-center justify-between gap-2">
          <p className="dash-section-label normal-case tracking-normal">
            확인 필요한 거래
          </p>
          {anomalies.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrev}
                disabled={!canGoPrev}
                className="ui-icon-btn disabled:opacity-30"
                aria-label="이전 거래"
              >
                <ChevronLeft size={18} strokeWidth={1.75} />
              </button>
              <span className="min-w-[2.5rem] text-center text-[12px] tabular-nums text-muted">
                {anomalies.length > 0 ? currentIndex + 1 : 0} / {anomalies.length}
              </span>
              <button
                type="button"
                onClick={goNext}
                disabled={!canGoNext}
                className="ui-icon-btn disabled:opacity-30"
                aria-label="다음 거래"
              >
                <ChevronRight size={18} strokeWidth={1.75} />
              </button>
            </div>
          )}
        </div>
        <p className="mt-1.5 dash-metric-xl">
          {anomalies.length}
          <span className="ml-1 text-[18px] font-medium text-muted">건</span>
        </p>

        {current ? (
          <div className="dash-inner-surface mt-5">
            <p className="text-[14px] font-medium text-ink">{current.transaction.merchant}</p>
            <p className="mt-1.5 text-[22px] font-semibold tracking-title-tight text-navy tabular-nums">
              {formatCurrency(current.transaction.amount)}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="info" size="sm">
                {current.transaction.category}
              </Badge>
              <Badge variant="warning" size="sm">
                {ANOMALY_TYPE_LABELS[current.type]}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="dash-inner-surface mt-5">
            <p className="text-[14px] text-ink2">
              {deferredAnomalies.length > 0 || pendingCoApprovals.length > 0
                ? "새로운 확인 대기 거래는 없습니다."
                : "현재 확인이 필요한 이상 거래가 없습니다."}
            </p>
          </div>
        )}
      </div>

      {current && (
        <Button
          variant="primary"
          className="mt-5 w-full shrink-0"
          onClick={() => onReview(current)}
        >
          검토하기
        </Button>
      )}
    </Card>
  );
}
