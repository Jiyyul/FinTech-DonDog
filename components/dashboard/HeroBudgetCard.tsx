"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Card from "@/components/common/Card";
import ProgressBar from "@/components/common/ProgressBar";
import AIMessage from "@/components/common/AIMessage";
import BudgetDoughnutChart from "@/components/charts/BudgetDoughnutChart";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { formatCurrency } from "@/lib/format";

export default function HeroBudgetCard() {
  const {
    budgetSlices,
    doughnutCenterPercent,
    budgetTotal,
    budgetUsed,
    budgetPendingUsed,
    budgetRemaining,
    budgetUsagePercent,
    budgetUsageSpeedPercent,
  } = useDashboardData();
  return (
    <Card className="flex h-full min-h-0 min-w-0 flex-col">
      <div className="mb-5 shrink-0">
        <p className="dash-section-label normal-case tracking-normal">
          2026년 1학기
        </p>
        <h2 className="mt-1 text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold tracking-title-tight text-navy">
          이번 학기 예산
        </h2>
      </div>

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="flex min-w-0 flex-col items-center justify-center overflow-visible py-1">
          <BudgetDoughnutChart
            slices={budgetSlices}
            centerPercent={doughnutCenterPercent}
            size="large"
          />
          <div className="mt-5 grid w-full max-w-md grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-x-3 gap-y-2">
            {budgetSlices.map((slice) => (
              <span
                key={slice.category}
                className="flex items-center gap-2 text-[12px] font-medium text-ink2"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="truncate">
                  {slice.category} {slice.percent}%
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center lg:pl-2">
          <p className="text-[clamp(2rem,3.2vw,2.65rem)] font-bold leading-none tracking-title-tight text-navy tabular-nums">
            {formatCurrency(budgetTotal)}
          </p>
          <p className="dash-section-label mt-2">총 예산</p>

          <div className="mt-6 grid grid-cols-2 gap-5">
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
              <span className="dash-kpi-highlight">{budgetUsagePercent}%</span>
            </div>
            <ProgressBar value={budgetUsagePercent} className="h-3" />
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              이번 달 평균 대비{" "}
              <span className="dash-kpi-warning">
                {budgetUsageSpeedPercent}%
              </span>{" "}
              빠른 속도로 사용 중
            </p>
            {budgetPendingUsed > 0 && (
              <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                검토 대기 지출 {formatCurrency(budgetPendingUsed)} — 승인 시 사용률에 반영됩니다
              </p>
            )}
          </div>

          <AIMessage className="mt-5 border-t border-hairline pt-4">
            이번 달 행사비 비중이 높습니다.
          </AIMessage>
        </div>
      </div>

      <div className="mt-5 shrink-0 border-t border-hairline pt-4">
        <Link href="/budget" className="block">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-2 text-[13px] font-medium text-muted transition-all duration-200 hover:gap-2.5 hover:text-navy"
          >
            예산 관리
            <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        </Link>
      </div>
    </Card>
  );
}
