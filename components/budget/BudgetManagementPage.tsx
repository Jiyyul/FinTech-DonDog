"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import type { BudgetCategory } from "@/lib/dashboard-types";
import { CATEGORY_COLORS } from "@/lib/chart-colors";
import { formatCurrency } from "@/lib/format";
import {
  useDashboardData,
  useDashboardDataMutator,
} from "@/components/providers/DashboardDataProvider";

type BudgetHistoryItem = {
  id: string;
  date: string;
  category: string;
  from: number;
  to: number;
  type: "budget_change";
};

type TrendFilter = "전체" | BudgetCategory;

const inputClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

function formatHistoryDate(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function sumByCategory(
  transactions: { category: BudgetCategory; amount: number }[]
) {
  const map = new Map<BudgetCategory, number>();
  for (const tx of transactions) {
    map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount);
  }
  return map;
}

export default function BudgetManagementPage() {
  const {
    budgetTotal,
    budgetUsed,
    budgetRemaining,
    categoryBudgets,
    allTransactions,
    monthlyBudgetTrend,
  } = useDashboardData();
  const setDashboardData = useDashboardDataMutator();

  const [totalBudgetInput, setTotalBudgetInput] = useState(String(budgetTotal));
  const [history, setHistory] = useState<BudgetHistoryItem[]>([]);
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("전체");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTotalBudgetInput(String(budgetTotal));
  }, [budgetTotal]);

  const usedByCategory = useMemo(
    () => sumByCategory(allTransactions),
    [allTransactions]
  );

  const categories = useMemo(
    () =>
      categoryBudgets.map((item) => ({
        ...item,
        used: usedByCategory.get(item.category) ?? 0,
        color: CATEGORY_COLORS[item.category],
      })),
    [categoryBudgets, usedByCategory]
  );

  const trendData = useMemo(() => {
    if (trendFilter === "전체") {
      return monthlyBudgetTrend.map((point) => point.used);
    }

    const byMonth = new Map<string, number>();
    for (const tx of allTransactions) {
      if (tx.category !== trendFilter) continue;
      const month = `${Number(tx.date.slice(5, 7))}월`;
      byMonth.set(month, (byMonth.get(month) ?? 0) + tx.amount);
    }

    return monthlyBudgetTrend.map((point) => byMonth.get(point.month) ?? 0);
  }, [allTransactions, monthlyBudgetTrend, trendFilter]);

  const trendMonths = monthlyBudgetTrend.map((point) => point.month);
  const trendMax = Math.max(...trendData, 1);

  const refreshDashboard = async () => {
    const res = await fetch("/api/dashboard-data", { cache: "no-store" });
    if (res.ok) {
      setDashboardData(await res.json());
    }
  };

  const handleTotalBudgetSave = async () => {
    const next = Number(totalBudgetInput);
    if (Number.isNaN(next) || next <= 0 || next === budgetTotal) return;

    setSaving(true);
    try {
      const res = await fetch("/api/budget-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalBudget: next }),
      });
      if (!res.ok) return;

      setHistory((prev) => [
        {
          id: `hist-total-${Date.now()}`,
          date: formatHistoryDate(new Date()),
          category: "총 예산",
          from: budgetTotal,
          to: next,
          type: "budget_change",
        },
        ...prev,
      ]);
      await refreshDashboard();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-ink2 transition-colors duration-200 hover:text-navy"
      >
        <ArrowLeft size={18} strokeWidth={1.75} />
        뒤로가기
      </Link>

      <div className="mb-8">
        <p className="dash-section-label normal-case tracking-normal">2026년 1학기</p>
        <h1 className="ui-page-title mt-1">예산 관리</h1>
      </div>

      <Card className="mb-8">
        <p className="mb-3 text-[13px] text-muted">총 예산 금액</p>
        <div className="flex flex-wrap items-end gap-3">
          <input
            type="number"
            value={totalBudgetInput}
            onChange={(e) => setTotalBudgetInput(e.target.value)}
            className={`min-w-[12rem] flex-1 ${inputClass}`}
            min={0}
          />
          <Button
            type="button"
            variant="primary"
            onClick={handleTotalBudgetSave}
            disabled={saving}
          >
            저장
          </Button>
        </div>
        <p className="mt-3 text-[clamp(1.5rem,2.5vw,2rem)] font-bold tabular-nums text-navy">
          {formatCurrency(budgetTotal)}
        </p>
        <p className="mt-1 text-[13px] text-muted">
          사용 {formatCurrency(budgetUsed)} · 잔액 {formatCurrency(budgetRemaining)}
        </p>
      </Card>

      <div className="space-y-4">
        {categories.map((item) => (
          <Card key={item.category}>
            <h2 className="text-[16px] font-semibold text-navy">{item.category}</h2>
            <dl className="mt-4 grid grid-cols-3 gap-3">
              <BudgetStat label="예산" value={formatCurrency(item.budget)} />
              <BudgetStat label="사용" value={formatCurrency(item.used)} />
              <BudgetStat
                label="남음"
                value={formatCurrency(item.budget - item.used)}
                highlight
              />
            </dl>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${item.budget > 0 ? Math.min(100, Math.round((item.used / item.budget) * 100)) : 0}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      {history.length > 0 && (
        <>
          <div className="my-8 border-t border-hairline" />
          <Card>
            <h2 className="mb-5 text-[16px] font-semibold text-navy">예산 변경 이력</h2>
            <ul className="space-y-5">
              {history.map((item) => (
                <li key={item.id} className="border-b border-hairline pb-5 last:border-0 last:pb-0">
                  <p className="text-[13px] font-medium text-muted">{item.date}</p>
                  <p className="mt-1 text-[15px] font-semibold text-ink">{item.category}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] tabular-nums">
                    <span className="text-ink2">{formatCurrency(item.from)}</span>
                    <ArrowRight size={14} className="text-muted" strokeWidth={1.75} />
                    <span className="font-semibold text-navy">{formatCurrency(item.to)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}

      <div className="my-8 border-t border-hairline" />

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-navy">월별 사용 추이</h2>
        <div className="mb-5 flex flex-wrap gap-2">
          {(["전체", ...categoryBudgets.map((c) => c.category)] as TrendFilter[]).map(
            (cat) => (
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
            )
          )}
        </div>
        <ul className="space-y-3">
          {trendMonths.map((month, index) => {
            const value = trendData[index] ?? 0;
            const width = trendMax > 0 ? Math.round((value / trendMax) * 100) : 0;
            const color =
              trendFilter === "전체"
                ? "#0A1680"
                : CATEGORY_COLORS[trendFilter as BudgetCategory];

            return (
              <li key={month} className="flex items-center gap-3">
                <span className="w-8 shrink-0 text-[13px] font-medium text-ink2">{month}</span>
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${width}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right text-[12px] tabular-nums text-muted">
                    {formatCurrency(value)}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

function BudgetStat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl bg-appbg p-3 ring-1 ring-hairline">
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd
        className={`mt-1 text-[14px] font-semibold tabular-nums ${
          highlight ? "text-navy" : "text-ink"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
