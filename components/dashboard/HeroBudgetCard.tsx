"use client";

import Link from "next/link";
import { MoreHorizontal, ArrowRight } from "lucide-react";
import Card from "@/components/common/Card";
import ProgressBar from "@/components/common/ProgressBar";
import AIMessage from "@/components/common/AIMessage";
import BudgetDoughnutChart from "@/components/charts/BudgetDoughnutChart";
import {
  BUDGET_SLICES,
  DOUGHNUT_CENTER_PERCENT,
  BUDGET_TOTAL,
  BUDGET_USED,
  BUDGET_REMAINING,
  BUDGET_USAGE_PERCENT,
  BUDGET_USAGE_SPEED_PERCENT,
} from "@/lib/dashboard-mock-data";
import { formatCurrency } from "@/lib/format";

export default function HeroBudgetCard() {
  return (
    <Card className="flex min-h-[520px] min-w-0 flex-col lg:min-h-[560px]">
      <div className="mb-6 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div>
          <p className="dash-section-label normal-case tracking-normal">
            2026년 1학기
          </p>
          <h2 className="mt-1 text-[clamp(1.35rem,2.4vw,1.75rem)] font-bold tracking-title-tight text-navy">
            이번 학기 예산
          </h2>
        </div>
        <button type="button" className="ui-icon-btn" aria-label="메뉴">
          <MoreHorizontal size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="grid min-h-0 flex-1 gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
        <div className="flex min-w-0 flex-col items-center justify-center overflow-visible">
          <BudgetDoughnutChart
            slices={BUDGET_SLICES}
            centerPercent={DOUGHNUT_CENTER_PERCENT}
          />
          <div className="mt-6 grid w-full max-w-md grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-x-3 gap-y-2">
            {BUDGET_SLICES.map((slice) => (
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

        <div className="flex min-w-0 flex-col justify-center border-t border-hairline pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="text-[clamp(2rem,3.5vw,2.75rem)] font-bold leading-none tracking-title-tight text-navy tabular-nums">
            {formatCurrency(BUDGET_TOTAL)}
          </p>
          <p className="dash-section-label mt-2">총 예산</p>

          <div className="mt-8 grid grid-cols-2 gap-6">
            <div>
              <p className="dash-section-label">사용</p>
              <p className="dash-metric-lg mt-1.5">{formatCurrency(BUDGET_USED)}</p>
            </div>
            <div>
              <p className="dash-section-label">잔액</p>
              <p className="dash-metric-lg mt-1.5">
                {formatCurrency(BUDGET_REMAINING)}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between">
              <span className="dash-section-label normal-case tracking-normal">
                사용률
              </span>
              <span className="dash-kpi-highlight">{BUDGET_USAGE_PERCENT}%</span>
            </div>
            <ProgressBar value={BUDGET_USAGE_PERCENT} className="h-3" />
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              이번 달 평균 대비{" "}
              <span className="dash-kpi-warning">
                {BUDGET_USAGE_SPEED_PERCENT}%
              </span>{" "}
              빠른 속도로 사용 중
            </p>
          </div>

          <AIMessage className="mt-6 border-t border-hairline pt-5">
            이번 달 행사비 비중이 높습니다.
          </AIMessage>
        </div>
      </div>

      <div className="mt-6 shrink-0 border-t border-hairline pt-4">
        <Link href="/budget" className="block">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-2 text-[13px] font-medium text-muted transition-all duration-200 hover:gap-2.5 hover:text-navy"
          >
            예산 상세보기
            <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        </Link>
      </div>
    </Card>
  );
}
