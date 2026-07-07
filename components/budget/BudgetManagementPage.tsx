"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import type { BudgetCategory } from "@/lib/dashboard-types";
import { CATEGORY_COLORS } from "@/lib/chart-colors";
import { formatCurrency } from "@/lib/format";

type CategoryBudget = {
  category: BudgetCategory;
  budget: number;
  used: number;
  color: string;
};

type BudgetHistoryItem = {
  id: string;
  date: string;
  category: string;
  from: number;
  to: number;
  actor?: string;
  type: "budget_change" | "ai_review";
  label?: string;
};

const INITIAL_CATEGORIES: CategoryBudget[] = [
  { category: "행사비", budget: 2_500_000, used: 1_870_000, color: CATEGORY_COLORS.행사비 },
  { category: "식비", budget: 1_500_000, used: 920_000, color: CATEGORY_COLORS.식비 },
  { category: "운영비", budget: 1_100_000, used: 744_800, color: CATEGORY_COLORS.운영비 },
  { category: "교통비", budget: 900_000, used: 585_200, color: CATEGORY_COLORS.교통비 },
  { category: "장비비", budget: 600_000, used: 478_800, color: CATEGORY_COLORS.장비비 },
  { category: "기타", budget: 400_000, used: 372_400, color: CATEGORY_COLORS.기타 },
];

const INITIAL_HISTORY: BudgetHistoryItem[] = [
  {
    id: "hist-1",
    date: "7월 2일",
    category: "행사비",
    from: 2_300_000,
    to: 2_500_000,
    actor: "홍길동",
    type: "budget_change",
  },
  {
    id: "hist-2",
    date: "6월 18일",
    category: "식비",
    from: 1_200_000,
    to: 1_500_000,
    type: "budget_change",
  },
  {
    id: "hist-3",
    date: "7월 3일",
    category: "행사비",
    from: 0,
    to: 0,
    type: "ai_review",
    label: "MT 펜션 예약 — 공동 승인 완료",
  },
  {
    id: "hist-4",
    date: "7월 1일",
    category: "식비",
    from: 0,
    to: 0,
    type: "ai_review",
    label: "한식당 모임 — 회칙 위반 검토 후 승인",
  },
];

const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월"] as const;

const MONTHLY_BY_CATEGORY: Record<string, number[]> = {
  전체: [620, 780, 1050, 890, 1120, 860],
  행사비: [280, 320, 450, 380, 520, 410],
  식비: [180, 210, 280, 240, 310, 250],
  운영비: [90, 120, 150, 130, 160, 110],
  교통비: [40, 55, 80, 60, 70, 50],
  장비비: [20, 45, 60, 50, 40, 30],
  기타: [10, 30, 40, 30, 20, 10],
};

type TrendFilter = "전체" | BudgetCategory;

const inputClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

function formatHistoryDate(date: Date): string {
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function BudgetManagementPage() {
  const [totalBudget, setTotalBudget] = useState(8_000_000);
  const [totalBudgetInput, setTotalBudgetInput] = useState("8000000");
  const [categories] = useState(INITIAL_CATEGORIES);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("전체");

  const trendData = MONTHLY_BY_CATEGORY[trendFilter] ?? MONTHLY_BY_CATEGORY.전체;
  const trendMax = Math.max(...trendData);

  const totalUsed = useMemo(
    () => categories.reduce((sum, c) => sum + c.used, 0),
    [categories]
  );

  const handleTotalBudgetSave = () => {
    const next = Number(totalBudgetInput);
    if (Number.isNaN(next) || next <= 0 || next === totalBudget) return;

    setHistory((prev) => [
      {
        id: `hist-total-${Date.now()}`,
        date: formatHistoryDate(new Date()),
        category: "총 예산",
        from: totalBudget,
        to: next,
        type: "budget_change",
      },
      ...prev,
    ]);
    setTotalBudget(next);
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
          <Button type="button" variant="primary" onClick={handleTotalBudgetSave}>
            저장
          </Button>
        </div>
        <p className="mt-3 text-[clamp(1.5rem,2.5vw,2rem)] font-bold tabular-nums text-navy">
          {formatCurrency(totalBudget)}
        </p>
        <p className="mt-1 text-[13px] text-muted">
          사용 {formatCurrency(totalUsed)} · 잔액 {formatCurrency(totalBudget - totalUsed)}
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
          </Card>
        ))}
      </div>

      <div className="my-8 border-t border-hairline" />

      <Card>
        <h2 className="mb-5 text-[16px] font-semibold text-navy">예산 변경 이력</h2>
        <ul className="space-y-5">
          {history.map((item) => (
            <li key={item.id} className="border-b border-hairline pb-5 last:border-0 last:pb-0">
              <p className="text-[13px] font-medium text-muted">{item.date}</p>
              {item.type === "budget_change" ? (
                <>
                  <p className="mt-1 text-[15px] font-semibold text-ink">{item.category}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[14px] tabular-nums">
                    <span className="text-ink2">{formatCurrency(item.from)}</span>
                    <ArrowRight size={14} className="text-muted" strokeWidth={1.75} />
                    <span className="font-semibold text-navy">{formatCurrency(item.to)}</span>
                  </div>
                  {item.actor && (
                    <p className="mt-2 text-[12px] text-muted">관리자 {item.actor}</p>
                  )}
                </>
              ) : (
                <>
                  <p className="mt-1 text-[15px] font-semibold text-ink">AI 검토</p>
                  <p className="mt-1 text-[14px] text-ink2">{item.label}</p>
                  <p className="mt-1 text-[12px] text-muted">{item.category}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <div className="my-8 border-t border-hairline" />

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-navy">월별 사용 추이</h2>
        <div className="mb-5 flex flex-wrap gap-2">
          {(["전체", ...INITIAL_CATEGORIES.map((c) => c.category)] as TrendFilter[]).map(
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
          {MONTHS.map((month, index) => {
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
                  <span className="w-16 shrink-0 text-right text-[12px] tabular-nums text-muted">
                    {formatCurrency(value * 10_000)}
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
