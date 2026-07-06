"use client";

import { useState } from "react";
import HeroBudgetCard from "@/components/dashboard/HeroBudgetCard";
import AuditCard from "@/components/dashboard/AuditCard";
import CalendarCard from "@/components/dashboard/CalendarCard";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import BudgetTrendCard from "@/components/dashboard/BudgetTrendCard";
import AIReportCard from "@/components/dashboard/AIReportCard";
import ActivityFeedCard from "@/components/dashboard/ActivityFeedCard";
import AuditModal from "@/components/dashboard/AuditModal";
import TransactionDrawer from "@/components/dashboard/TransactionDrawer";
import FloatingAIChat from "@/components/ai/FloatingAIChat";
import type { DashboardTransaction } from "@/lib/dashboard-types";

export default function Dashboard() {
  const [auditOpen, setAuditOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<DashboardTransaction | null>(null);

  const handleSelectTransaction = (tx: DashboardTransaction) => {
    setSelectedTx(tx);
    setDrawerOpen(true);
  };

  return (
    <div className="min-w-0 space-y-10">
      {/* Row 1 — 이번 학기 예산 · AI Audit */}
      <section className="dash-row-duo">
        <div className="dash-grid-cell min-w-0">
          <HeroBudgetCard />
        </div>
        <div className="dash-grid-cell min-w-0">
          <AuditCard
            className="h-full min-h-[360px]"
            onReview={() => setAuditOpen(true)}
          />
        </div>
      </section>

      {/* Row 2 — 일정 · 월별 예산 추이 · AI 회계 리포트 */}
      <section className="dash-row-triple">
        <div className="dash-grid-cell min-w-0">
          <CalendarCard variant="compact" className="h-full min-h-[360px]" />
        </div>
        <div className="dash-grid-cell min-w-0">
          <BudgetTrendCard className="h-full min-h-[360px]" />
        </div>
        <div className="dash-grid-cell min-w-0">
          <AIReportCard className="h-full min-h-[360px]" />
        </div>
      </section>

      {/* Row 3 — 최근 거래내역 · 최근 활동 */}
      <section className="dash-row-bottom">
        <div className="dash-grid-cell min-w-0">
          <RecentTransactions onSelect={handleSelectTransaction} />
        </div>
        <div className="dash-grid-cell min-w-0">
          <ActivityFeedCard className="h-full min-h-0" />
        </div>
      </section>

      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />

      <TransactionDrawer
        open={drawerOpen}
        transaction={selectedTx}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedTx(null);
        }}
      />

      <FloatingAIChat />
    </div>
  );
}
