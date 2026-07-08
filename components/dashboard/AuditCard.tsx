"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { formatCurrency } from "@/lib/format";
import { ANOMALY_TYPE_LABELS, type AuditAnomaly } from "@/lib/dashboard-types";

type AuditCardProps = {
  anomalies: AuditAnomaly[];
  deferredAnomalies: AuditAnomaly[];
  onReview: (anomaly: AuditAnomaly) => void;
  onReviewDeferred?: (anomaly: AuditAnomaly) => void;
  className?: string;
  preview?: boolean;
};

export default function AuditCard({
  anomalies,
  deferredAnomalies,
  onReview,
  onReviewDeferred,
  className = "",
  preview = false,
}: AuditCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalCount = anomalies.length + deferredAnomalies.length;
  const current = anomalies[currentIndex];

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, Math.max(0, anomalies.length - 1)));
  }, [anomalies.length]);

  const showArrows = !preview && anomalies.length > 1;

  const goToPrevious = () => {
    setCurrentIndex((index) => (index === 0 ? anomalies.length - 1 : index - 1));
  };

  const goToNext = () => {
    setCurrentIndex((index) => (index === anomalies.length - 1 ? 0 : index + 1));
  };

  return (
    <Card
      className={`flex min-w-0 flex-col ${
        preview ? "!p-4 hover:scale-100 hover:shadow-card" : ""
      } ${className}`}
    >
      <div className={`flex shrink-0 items-start justify-between gap-3 ${preview ? "mb-3" : "mb-5"}`}>
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

      {!preview && deferredAnomalies.length > 0 && (
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
        <p className="dash-section-label normal-case tracking-normal">
          확인 필요한 거래
        </p>
        <p className={`mt-1.5 ${preview ? "text-[1.75rem] font-bold tracking-title-tight text-navy tabular-nums" : "dash-metric-xl"}`}>
          {anomalies.length}
          <span className={`ml-1 font-medium text-muted ${preview ? "text-[15px]" : "text-[18px]"}`}>
            건
          </span>
        </p>

        {current ? (
          <div className={`mt-5 flex items-center gap-2 ${preview ? "mt-4" : ""}`}>
            {showArrows && (
              <button
                type="button"
                onClick={goToPrevious}
                className="ui-icon-btn h-8 w-8 shrink-0"
                aria-label="이전 알림"
              >
                <ChevronLeft size={15} strokeWidth={1.5} />
              </button>
            )}
            <div className="dash-inner-surface min-w-0 flex-1 text-left">
              <p className="text-[14px] font-medium leading-snug text-ink">
                {current.transaction.merchant}
              </p>
              <p
                className={`mt-1.5 font-semibold tracking-title-tight text-navy tabular-nums whitespace-nowrap ${
                  preview ? "text-left text-[1.25rem]" : "text-[22px]"
                }`}
              >
                {formatCurrency(current.transaction.amount)}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <Badge variant="info" size="sm">
                  {current.transaction.category}
                </Badge>
                <Badge variant="warning" size="sm">
                  {ANOMALY_TYPE_LABELS[current.type]}
                </Badge>
              </div>
            </div>
            {showArrows && (
              <button
                type="button"
                onClick={goToNext}
                className="ui-icon-btn h-8 w-8 shrink-0"
                aria-label="다음 알림"
              >
                <ChevronRight size={15} strokeWidth={1.5} />
              </button>
            )}
          </div>
        ) : (
          <div className="dash-inner-surface mt-5">
            <p className="text-[14px] text-ink2">
              {deferredAnomalies.length > 0
                ? "새로운 확인 대기 거래는 없습니다."
                : "현재 확인이 필요한 이상 거래가 없습니다."}
            </p>
          </div>
        )}
      </div>

      {current && !preview && (
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
