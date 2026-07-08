"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AnomalyDetailDrawer from "@/components/anomalies/AnomalyDetailDrawer";
import AnomalySummaryCards from "@/components/anomalies/AnomalySummaryCards";
import AnomalyTable from "@/components/anomalies/AnomalyTable";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { computeAnomalySummary, groupAnomaliesByTransaction } from "@/lib/anomalies/anomaly-types";
import {
  buildSchedules,
  detectPaymentAnomalies,
  toRuleEngineTransactions,
} from "@/lib/anomalies/from-payments";
import type { Transaction } from "@/lib/transactions/transaction-types";

export default function AuditOverviewPage() {
  const { allTransactions, budgetTotal, amountThreshold, calendarEvents } = useDashboardData();

  const transactions = useMemo(
    () => toRuleEngineTransactions(allTransactions),
    [allTransactions]
  );
  const schedules = useMemo(() => buildSchedules(calendarEvents), [calendarEvents]);
  const results = useMemo(
    () => detectPaymentAnomalies(allTransactions, budgetTotal, amountThreshold, calendarEvents),
    [allTransactions, budgetTotal, amountThreshold, calendarEvents]
  );

  const groups = useMemo(() => groupAnomaliesByTransaction(results), [results]);
  const summary = useMemo(
    () => computeAnomalySummary(transactions.length, results),
    [transactions, results]
  );

  const [selected, setSelected] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-8 pb-10">
      <Link
        href="/audit"
        className="inline-flex items-center gap-2 text-[14px] font-medium text-ink2 transition-colors duration-200 hover:text-navy"
      >
        <ArrowLeft size={18} strokeWidth={1.75} />
        이상거래 검토로
      </Link>

      <div>
        <p className="dash-section-label normal-case tracking-normal">AI 감사</p>
        <h1 className="ui-page-title mt-1">이상거래 감지 — 전체 보기</h1>
        <p className="ui-page-subtitle">
          규칙 기반으로 예산 초과, 고액 지출, 중복 결제, 일정 불일치, 영수증 누락을 자동으로
          확인합니다.
        </p>
      </div>

      <AnomalySummaryCards summary={summary} />

      <AnomalyTable
        transactions={transactions}
        groups={groups}
        schedules={schedules}
        onSelect={(tx) => {
          setSelected(tx);
          setDrawerOpen(true);
        }}
      />

      <AnomalyDetailDrawer
        open={drawerOpen}
        transaction={selected}
        group={selected ? groups.get(selected.id) : undefined}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
