"use client";

import { useMemo, useState } from "react";
import Card from "@/components/common/Card";
import AIMessage from "@/components/common/AIMessage";
import BudgetTrendChart from "@/components/charts/BudgetTrendChart";
import MonthlyTransactionsModal from "@/components/budget/MonthlyTransactionsModal";
import TransactionDrawer from "@/components/dashboard/TransactionDrawer";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import type { BudgetCategory, BudgetTrendFilter, DashboardTransaction } from "@/lib/dashboard-types";
import { CATEGORY_COLORS, CHART_UI } from "@/lib/chart-colors";
import { formatChangeRate } from "@/lib/dashboard-utils";

const TREND_CATEGORIES = Object.keys(CATEGORY_COLORS) as BudgetCategory[];

type BudgetTrendCardProps = {
  className?: string;
  preview?: boolean;
  emptyData?: boolean;
};

export default function BudgetTrendCard({
  className = "",
  preview = false,
  emptyData = false,
}: BudgetTrendCardProps) {
  const { monthlyBudgetTrend, categoryMonthlyTrend, allTransactions } = useDashboardData();
  const [trendFilter, setTrendFilter] = useState<BudgetTrendFilter>("전체");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(null);
  const [selectedTx, setSelectedTx] = useState<DashboardTransaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const trendData = useMemo(() => {
    if (emptyData || monthlyBudgetTrend.length === 0) return [];
    if (trendFilter === "전체") return monthlyBudgetTrend;
    return categoryMonthlyTrend[trendFilter] ?? [];
  }, [emptyData, trendFilter, monthlyBudgetTrend, categoryMonthlyTrend]);

  const latest = trendData[trendData.length - 1];
  const showEmptyState = trendData.length === 0;
  const lineColor =
    trendFilter === "전체" ? CHART_UI.navy : CATEGORY_COLORS[trendFilter as BudgetCategory];

  const selectedMonthLabel =
    selectedMonthIndex !== null ? trendData[selectedMonthIndex]?.month ?? "" : "";

  const monthlyTransactions = useMemo(() => {
    if (selectedMonthIndex === null || emptyData) return [];
    const monthNumber = Number(selectedMonthLabel.replace("월", ""));
    if (!monthNumber) return [];
    return allTransactions
      .filter((tx) => Number(tx.date.slice(5, 7)) === monthNumber)
      .filter((tx) => trendFilter === "전체" || tx.category === trendFilter)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [selectedMonthIndex, selectedMonthLabel, trendFilter, emptyData, allTransactions]);

  const insightMessage =
    emptyData || !latest
      ? "거래 내역이 쌓이면 월별 추이를 확인할 수 있습니다."
      : trendFilter === "전체"
        ? `${latest.month} 사용액 전월 대비 ${formatChangeRate(latest.changeRate)} 변동했습니다.`
        : `${latest.month} ${trendFilter} 전월 대비 ${formatChangeRate(latest.changeRate)} 변동했습니다.`;

  return (
    <>
      <Card
        className={`flex min-w-0 flex-col ${
          preview
            ? "!min-h-0 !p-3 !shadow-none hover:scale-100 hover:shadow-card"
            : "min-h-[480px]"
        } ${className}`}
      >
        <div className={`shrink-0 ${preview ? "mb-2" : "mb-4"}`}>
          <h3 className={`dash-card-title ${preview ? "text-sm" : ""}`}>월별 예산 추이</h3>
          {!preview && !emptyData && trendData.length > 0 && (
            <>
              <div className="mt-4 flex flex-wrap gap-2">
                {(["전체", ...TREND_CATEGORIES] as BudgetTrendFilter[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTrendFilter(cat)}
                    className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-200 ${
                      trendFilter === cat
                        ? "bg-navy text-inverse"
                        : "bg-surface text-ink2 ring-1 ring-hairline hover:text-ink"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[12px] text-muted">
                차트의 월을 클릭하면 선택한 카테고리의 결제내역을 확인할 수 있습니다.
              </p>
            </>
          )}
        </div>

        <div className={`min-h-0 flex-1 ${preview ? "px-0" : "overflow-visible px-0.5"}`}>
          {showEmptyState ? (
            <div
              className={`flex h-full w-full items-center justify-center ${
                preview ? "min-h-[110px]" : "min-h-[240px]"
              }`}
            >
              <p className="text-center text-[14px] text-muted">
                아직 거래가 진행되지 않았습니다.
              </p>
            </div>
          ) : (
            <BudgetTrendChart
              preview={preview}
              data={trendData}
              lineColor={lineColor}
              showBudget={trendFilter === "전체"}
              onMonthClick={
                !preview && !emptyData && trendData.length > 0
                  ? (monthIndex) => setSelectedMonthIndex(monthIndex)
                  : undefined
              }
            />
          )}
        </div>

        {!preview && (
          <AIMessage className="mt-6 shrink-0 border-t border-hairline pt-5">
            {insightMessage}
          </AIMessage>
        )}
      </Card>

      {!preview && !emptyData && trendData.length > 0 && (
        <>
          <MonthlyTransactionsModal
            open={selectedMonthIndex !== null}
            monthLabel={selectedMonthLabel}
            filter={trendFilter}
            transactions={monthlyTransactions}
            onClose={() => setSelectedMonthIndex(null)}
            onSelect={(tx) => {
              setSelectedTx(tx);
              setDrawerOpen(true);
            }}
          />

          <TransactionDrawer
            open={drawerOpen}
            transaction={selectedTx}
            onClose={() => {
              setDrawerOpen(false);
              setSelectedTx(null);
            }}
            onCategoryChange={(category) => {
              setSelectedTx((prev) => (prev ? { ...prev, category } : null));
            }}
          />
        </>
      )}
    </>
  );
}
