"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Card from "@/components/common/Card";
import ProgressBar from "@/components/common/ProgressBar";
import AIMessage from "@/components/common/AIMessage";
import BudgetDoughnutChart from "@/components/charts/BudgetDoughnutChart";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { formatCurrency } from "@/lib/format";

type HeroBudgetCardProps = {
  preview?: boolean;
  emptyData?: boolean;
  semester?: string;
};

export default function HeroBudgetCard({
  preview = false,
  emptyData = false,
  semester = "2026년 1학기",
}: HeroBudgetCardProps) {
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

  const metricClass = preview
    ? "mt-1.5 text-[15px] font-semibold tracking-title-tight text-navy tabular-nums whitespace-nowrap"
    : "dash-metric-lg mt-1.5";

  const total = emptyData ? 0 : budgetTotal;
  const used = emptyData ? 0 : budgetUsed;
  const remaining = emptyData ? 0 : budgetRemaining;
  const usagePercent = emptyData ? 0 : budgetUsagePercent;
  const usageSpeedPercent = emptyData ? 0 : budgetUsageSpeedPercent;
  const pendingUsed = emptyData ? 0 : budgetPendingUsed;
  const slices = emptyData ? [] : budgetSlices;
  const centerPercent = emptyData ? 0 : doughnutCenterPercent;

  return (
    <Card
      className={`flex h-full min-h-0 min-w-0 flex-col ${
        preview ? "!p-4 hover:scale-100 hover:shadow-card" : ""
      }`}
    >
      <div className={`shrink-0 ${preview ? "mb-3" : "mb-5"}`}>
        <p className="dash-section-label normal-case tracking-normal">
          {semester}
        </p>
        <h2
          className={`mt-1 font-bold tracking-title-tight text-navy ${
            preview ? "text-base" : "text-[clamp(1.35rem,2.4vw,1.75rem)]"
          }`}
        >
          이번 학기 예산
        </h2>
      </div>

      {preview ? (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="flex shrink-0 flex-col items-center">
              <BudgetDoughnutChart
                preview
                slices={slices}
                centerPercent={centerPercent}
                size="compact"
              />
              {!emptyData && (
              <div className="mt-2 grid w-[6.5rem] grid-cols-1 gap-1">
                {slices.map((slice) => (
                  <span
                    key={slice.category}
                    className="flex items-center gap-1.5 text-[9px] font-medium leading-none text-ink2"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <span className="truncate">
                      {slice.category} {slice.percent}%
                    </span>
                  </span>
                ))}
              </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold leading-none tracking-title-tight text-navy tabular-nums whitespace-nowrap">
                {formatCurrency(total)}
              </p>
              <p className="dash-section-label mt-1 text-[10px]">총 예산</p>

              <div className="mt-2.5 flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="dash-section-label shrink-0 text-[10px]">사용</p>
                  <p className="text-[11px] font-semibold tracking-title-tight text-navy tabular-nums whitespace-nowrap">
                    {formatCurrency(used)}
                  </p>
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <p className="dash-section-label shrink-0 text-[10px]">잔액</p>
                  <p className="text-[11px] font-semibold tracking-title-tight text-navy tabular-nums whitespace-nowrap">
                    {formatCurrency(remaining)}
                  </p>
                </div>
              </div>

              <div className="mt-2.5">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="dash-section-label text-[10px] normal-case tracking-normal">
                    사용률
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-navy">
                    {usagePercent}%
                  </span>
                </div>
                <ProgressBar value={usagePercent} className="h-2" />
              </div>
            </div>
          </div>

          <AIMessage className="border-t border-hairline pt-2.5 [&_.dash-body]:text-[11px]">
            {emptyData
              ? "예산을 설정하고 거래를 등록하면 분석이 시작됩니다."
              : "이번 달 행사비 비중이 높습니다."}
          </AIMessage>
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="flex min-w-0 flex-col items-center justify-center overflow-visible py-1">
            {emptyData ? (
              <div className="flex h-[244px] w-[244px] items-center justify-center rounded-full bg-surface ring-1 ring-hairline">
                <p className="px-6 text-center text-[13px] leading-relaxed text-muted">
                  아직 등록된
                  <br />
                  예산이 없습니다
                </p>
              </div>
            ) : (
              <>
                <BudgetDoughnutChart
                  slices={slices}
                  centerPercent={centerPercent}
                  size="large"
                />
                <div className="mt-5 grid w-full max-w-md grid-cols-[repeat(auto-fit,minmax(6.5rem,1fr))] gap-x-3 gap-y-2">
                  {slices.map((slice) => (
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
              </>
            )}
          </div>

          <div className="flex min-w-0 flex-col justify-center lg:pl-2">
            <p className="text-[clamp(2rem,3.2vw,2.65rem)] font-bold leading-none tracking-title-tight text-navy tabular-nums">
              {formatCurrency(total)}
            </p>
            <p className="dash-section-label mt-2">총 예산</p>

            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <p className="dash-section-label">사용</p>
                <p className={metricClass}>{formatCurrency(used)}</p>
              </div>
              <div>
                <p className="dash-section-label">잔액</p>
                <p className={metricClass}>{formatCurrency(remaining)}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="dash-section-label normal-case tracking-normal">
                  사용률
                </span>
                <span className="dash-kpi-highlight">{usagePercent}%</span>
              </div>
              <ProgressBar value={usagePercent} className="h-3" />
              {!emptyData && (
                <p className="mt-3 text-[13px] leading-relaxed text-muted">
                  이번 달 평균 대비{" "}
                  <span className="dash-kpi-warning">{usageSpeedPercent}%</span>{" "}
                  빠른 속도로 사용 중
                </p>
              )}
              {!emptyData && pendingUsed > 0 && (
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">
                  검토 대기 지출 {formatCurrency(pendingUsed)} — 승인 시 사용률에 반영됩니다
                </p>
              )}
            </div>

            <AIMessage className="mt-5 border-t border-hairline pt-4">
              {emptyData
                ? "예산을 설정하고 거래를 등록하면 분석이 시작됩니다."
                : "이번 달 행사비 비중이 높습니다."}
            </AIMessage>
          </div>
        </div>
      )}

      {!preview && (
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
      )}
    </Card>
  );
}
