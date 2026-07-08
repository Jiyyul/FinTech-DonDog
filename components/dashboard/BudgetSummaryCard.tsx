"use client";

import Card from "@/components/common/Card";
import ProgressBar from "@/components/common/ProgressBar";
import AIMessage from "@/components/common/AIMessage";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { formatCurrency } from "@/lib/format";

export default function BudgetSummaryCard() {
  const {
    budgetTotal,
    budgetUsed,
    budgetRemaining,
    budgetUsagePercent,
    budgetUsageSpeedPercent,
  } = useDashboardData();

  return (
    <Card className="flex min-h-[420px] min-w-0 flex-col">
      <h3 className="dash-card-title mb-5 shrink-0">예산 요약</h3>

      <div className="flex min-h-0 flex-1 flex-col">
        <div>
          <p className="dash-metric-xl">{formatCurrency(budgetTotal)}</p>
          <p className="dash-section-label mt-2">총 예산</p>
        </div>

        <div className="my-5 h-px bg-hairline" />

        <div className="grid grid-cols-2 gap-4 min-[1280px]:gap-6">
          <div>
            <p className="dash-section-label">사용</p>
            <p className="dash-metric-lg mt-1.5">{formatCurrency(budgetUsed)}</p>
          </div>
          <div>
            <p className="dash-section-label">잔액</p>
            <p className="dash-metric-lg mt-1.5">
              {formatCurrency(budgetRemaining)}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="dash-section-label normal-case tracking-normal">
              사용률
            </span>
            <span className="dash-kpi-highlight">
              {budgetUsagePercent}%
            </span>
          </div>
          <ProgressBar value={budgetUsagePercent} />
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            이번 달 평균 대비{" "}
            <span className="dash-kpi-warning">
              {budgetUsageSpeedPercent}%
            </span>{" "}
            빠른 속도로 사용 중
          </p>
        </div>
      </div>

      <AIMessage className="mt-5 shrink-0 border-t border-hairline pt-4">
        이번 달 행사비 비중이 높습니다.
      </AIMessage>
    </Card>
  );
}
