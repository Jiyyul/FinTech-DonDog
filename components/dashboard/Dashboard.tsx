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
    <div className="min-w-0">
      {/* Tier 1 — Budget hero + AI audit + calendar */}
      <section className="dash-grid-hero mb-10">
        <div className="dash-hero-budget min-w-0">
          <HeroBudgetCard />
        </div>
        <div className="dash-audit-slot min-w-0">
          <AuditCard
            className="h-full min-h-[360px]"
            onReview={() => setAuditOpen(true)}
          />
        </div>
        <div className="dash-calendar-slot min-w-0">
          <CalendarCard variant="compact" />
        </div>
      </section>

      {/* Tier 2 — Transactions (primary) + Budget trend */}
      <section className="dash-grid-operations mb-10">
        <div className="dash-transactions-slot min-w-0">
          <RecentTransactions onSelect={handleSelectTransaction} />
        </div>
        <div className="dash-trend-slot min-w-0">
          <BudgetTrendCard />
        </div>
      </section>

      {/* Tier 3 — AI insights + activity timeline */}
      <section className="dash-grid-insights">
        <div className="dash-report-slot min-w-0">
          <AIReportCard className="min-h-[320px]" />
        </div>
        <div className="dash-activity-slot min-w-0">
          <ActivityFeedCard className="min-h-[320px] lg:max-w-none" />
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
