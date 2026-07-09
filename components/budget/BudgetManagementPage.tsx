"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import type { BudgetCategory } from "@/lib/dashboard-types";
import { formatCurrency } from "@/lib/format";
import { updateCategoryBudgetAction, updateTotalBudgetAction } from "@/lib/actions/budget-actions";
import { useAuth } from "@/components/providers/AuthProvider";
import type { BudgetPageData } from "@/lib/get-budget-data";

type TrendFilter = "전체" | BudgetCategory;

const inputClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

export default function BudgetManagementPage({ data }: { data: BudgetPageData }) {
  const router = useRouter();
  const { canEdit } = useAuth();
  const { totalBudget, totalUsed, categories, history, months, monthlyByCategory } = data;

  const [totalBudgetInput, setTotalBudgetInput] = useState(String(totalBudget));
  const [saving, setSaving] = useState(false);
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("전체");
  const [categoryInputs, setCategoryInputs] = useState<Record<string, string>>(() =>
    Object.fromEntries(categories.map((c) => [c.category, String(c.budget)]))
  );
  const [savingCategory, setSavingCategory] = useState<BudgetCategory | null>(null);

  const trendData = monthlyByCategory[trendFilter] ?? monthlyByCategory.전체 ?? [];
  const trendMax = Math.max(1, ...trendData);

  const handleTotalBudgetSave = async () => {
    const next = Number(totalBudgetInput);
    if (!Number.isFinite(next) || next <= 0 || next === totalBudget) return;
    setSaving(true);
    try {
      await updateTotalBudgetAction(next);
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryBudgetSave = async (category: BudgetCategory) => {
    const next = Number(categoryInputs[category]);
    const current = categories.find((c) => c.category === category)?.budget ?? 0;
    if (!Number.isFinite(next) || next < 0 || next === current) return;
    setSavingCategory(category);
    try {
      await updateCategoryBudgetAction(category, next);
      router.refresh();
    } finally {
      setSavingCategory(null);
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
          <Button type="button" variant="primary" onClick={handleTotalBudgetSave} disabled={!canEdit || saving}>
            {saving ? "저장 중..." : "저장"}
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
            <div className="mt-3 flex items-end gap-2">
              <input
                type="number"
                value={categoryInputs[item.category] ?? String(item.budget)}
                onChange={(e) =>
                  setCategoryInputs((prev) => ({ ...prev, [item.category]: e.target.value }))
                }
                className={`flex-1 ${inputClass}`}
                min={0}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleCategoryBudgetSave(item.category)}
                disabled={savingCategory === item.category}
              >
                {savingCategory === item.category ? "저장 중..." : "예산 저장"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="my-8 border-t border-hairline" />

      <Card>
        <h2 className="mb-5 text-[16px] font-semibold text-navy">예산 변경 이력</h2>
        {history.length === 0 ? (
          <p className="text-[14px] text-muted">아직 변경 이력이 없습니다.</p>
        ) : (
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
        )}
      </Card>

      <div className="my-8 border-t border-hairline" />

      <Card>
        <h2 className="mb-4 text-[16px] font-semibold text-navy">월별 사용 추이</h2>
        {months.length === 0 ? (
          <p className="text-[14px] text-muted">표시할 거래 내역이 없습니다.</p>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap gap-2">
              {(["전체", ...categories.map((c) => c.category)] as TrendFilter[]).map((cat) => (
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
            <ul className="space-y-3">
              {months.map((month, index) => {
                const value = trendData[index] ?? 0;
                const width = trendMax > 0 ? Math.round((value / trendMax) * 100) : 0;
                const color =
                  trendFilter === "전체"
                    ? "#0A1680"
                    : categories.find((c) => c.category === trendFilter)?.color ?? "#0A1680";

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
          </>
        )}
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
