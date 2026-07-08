"use client";

import { useMemo, useState } from "react";
import AnomalyDetailDrawer from "@/components/anomalies/AnomalyDetailDrawer";
import AnomalySummaryCards from "@/components/anomalies/AnomalySummaryCards";
import AnomalyTable from "@/components/anomalies/AnomalyTable";
import { getAnomalies, getGroupSettings, getSchedules, getTransactions } from "@/lib/db/mock-db";
import { computeAnomalySummary, groupAnomaliesByTransaction } from "@/lib/anomalies/anomaly-types";
import type { Transaction } from "@/lib/transactions/transaction-types";

export default function AuditDashboardPage() {
  const [transactions] = useState<Transaction[]>(() => getTransactions());
  const schedules = useMemo(() => getSchedules(), []);
  const groupSettings = useMemo(() => getGroupSettings(), []);
  const results = useMemo(() => getAnomalies(), []);

  const groups = useMemo(() => groupAnomaliesByTransaction(results), [results]);
  const summary = useMemo(
    () => computeAnomalySummary(transactions.length, results),
    [transactions, results]
  );

  const [selected, setSelected] = useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-8 pb-10">
      <div>
        <p className="dash-section-label normal-case tracking-normal">{groupSettings.name}</p>
        <h1 className="ui-page-title mt-1">이상거래 감지</h1>
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
