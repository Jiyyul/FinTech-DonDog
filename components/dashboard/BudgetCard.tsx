"use client";

import Link from "next/link";
import { MoreHorizontal, ArrowRight } from "lucide-react";
import Card from "@/components/common/Card";
import BudgetDoughnutChart from "@/components/charts/BudgetDoughnutChart";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";

export default function BudgetCard() {
  const { budgetSlices, doughnutCenterPercent } = useDashboardData();
  return (
    <Card className="flex min-h-[420px] min-w-0 flex-col">
      <div className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <h3 className="dash-card-title">이번 학기 예산</h3>
        <button type="button" className="ui-icon-btn" aria-label="메뉴">
          <MoreHorizontal size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-visible">
        <BudgetDoughnutChart
          slices={budgetSlices}
          centerPercent={doughnutCenterPercent}
        />

        <div className="mt-6 grid w-full grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-x-4 gap-y-2.5 px-1">
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

      <div className="mt-5 shrink-0 border-t border-hairline pt-4">
        <Link href="/budget" className="block">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-2 text-[13px] font-medium text-muted transition-all duration-200 hover:gap-2.5 hover:text-ink"
          >
            예산 상세보기
            <ArrowRight size={15} strokeWidth={1.5} />
          </button>
        </Link>
      </div>
    </Card>
  );
}
