"use client";

import HeroBudgetCard from "@/components/dashboard/HeroBudgetCard";
import AuditCard from "@/components/dashboard/AuditCard";
import BudgetTrendCard from "@/components/dashboard/BudgetTrendCard";
import { ANOMALY_QUEUE } from "@/lib/dashboard-mock-data";

function noop() {}

export default function DashboardMockup() {
  return (
    <div className="group relative w-full max-w-[640px]">
      {/* Laptop */}
      <div className="transition-transform duration-300 ease-premium group-hover:-translate-y-1.5">
        <div className="overflow-hidden rounded-[20px] border border-hairline bg-card shadow-[0_24px_60px_rgba(10,22,128,0.12)]">
          <div className="flex items-center gap-2 border-b border-hairline bg-surface/80 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
            <span className="ml-2 text-[11px] font-medium text-muted">
              app.dondog.kr/dashboard
            </span>
          </div>
          <div className="pointer-events-none overflow-hidden bg-dashbg p-3 sm:p-4">
            <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
              <HeroBudgetCard preview />
              <AuditCard
                preview
                anomalies={ANOMALY_QUEUE}
                deferredAnomalies={[]}
                onReview={noop}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="absolute -bottom-6 -right-2 w-[40%] min-w-[155px] max-w-[210px] transition-transform duration-300 ease-premium group-hover:-translate-y-1.5 sm:-right-6">
        <div className="overflow-hidden rounded-[28px] border-[6px] border-ink/90 bg-ink shadow-[0_20px_50px_rgba(10,22,128,0.18)]">
          <div className="h-5 bg-ink" />
          <div className="pointer-events-none flex min-h-[210px] items-center justify-center overflow-hidden bg-dashbg p-2.5">
            <div className="w-full">
              <BudgetTrendCard preview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
