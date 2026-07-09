"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import { formatCurrency } from "@/lib/format";
import { updateTotalBudgetAction, updateAnomalyThresholdAction } from "@/lib/actions/budget-actions";
import type { BudgetPageData } from "@/lib/get-budget-data";

const inputClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

export default function BudgetManagementPage({ data }: { data: BudgetPageData }) {
  const router = useRouter();
  const { totalBudget, totalUsed, anomalyThreshold, history } = data;

  const [totalBudgetInput, setTotalBudgetInput] = useState(String(totalBudget));
  const [anomalyThresholdInput, setAnomalyThresholdInput] = useState(String(anomalyThreshold));
  const [saving, setSaving] = useState(false);
  const [savingThreshold, setSavingThreshold] = useState(false);

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

  const handleAnomalyThresholdSave = async () => {
    const next = Number(anomalyThresholdInput);
    if (!Number.isFinite(next) || next <= 0 || next === anomalyThreshold) return;
    setSavingThreshold(true);
    try {
      await updateAnomalyThresholdAction(next);
      router.refresh();
    } finally {
      setSavingThreshold(false);
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
          <Button type="button" variant="primary" onClick={handleTotalBudgetSave} disabled={saving}>
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

      <Card className="mb-8">
        <p className="mb-3 text-[13px] text-muted">이상감지 기준 금액</p>
        <div className="flex flex-wrap items-end gap-3">
          <input
            type="number"
            value={anomalyThresholdInput}
            onChange={(e) => setAnomalyThresholdInput(e.target.value)}
            className={`min-w-[12rem] flex-1 ${inputClass}`}
            min={1}
          />
          <Button
            type="button"
            variant="primary"
            onClick={handleAnomalyThresholdSave}
            disabled={savingThreshold}
          >
            {savingThreshold ? "저장 중..." : "저장"}
          </Button>
        </div>
        <p className="mt-3 text-[clamp(1.5rem,2.5vw,2rem)] font-bold tabular-nums text-navy">
          {formatCurrency(anomalyThreshold)}
        </p>
        <p className="mt-1 text-[13px] text-muted">
          이 금액 이상 결제 시 AI 이상감지 및 공동 승인 검토 대상으로 분류됩니다.
        </p>
      </Card>

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
    </div>
  );
}
