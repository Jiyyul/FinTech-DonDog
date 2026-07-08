"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDashboardDataMutator } from "@/components/providers/DashboardDataProvider";
import { submitAuditReview } from "@/lib/audit-client";
import type { DashboardData } from "@/lib/get-dashboard-data";
import type { AuditAnomaly, BudgetCategory } from "@/lib/dashboard-types";

async function fetchDashboardData(): Promise<DashboardData | null> {
  const res = await fetch("/api/dashboard-data", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json() as Promise<DashboardData>;
}

export function useAuditReviewActions() {
  const router = useRouter();
  const setDashboardData = useDashboardDataMutator();

  const refreshDashboard = useCallback(async () => {
    const nextData = await fetchDashboardData();
    if (nextData) {
      setDashboardData(nextData);
    }
    router.refresh();
  }, [router, setDashboardData]);

  const persistReview = useCallback(
    async (
      anomaly: AuditAnomaly,
      action:
        | "approved"
        | "deferred"
        | "exception"
        | "co_approved"
        | "co_approval_pending"
        | "category_change",
      options?: {
        category?: BudgetCategory;
        relatedScheduleId?: string;
        relatedScheduleTitle?: string;
      }
    ) => {
      await submitAuditReview({
        paymentId: anomaly.transaction.paymentId,
        anomalyType: anomaly.type,
        action,
        category: options?.category,
        relatedScheduleId: options?.relatedScheduleId,
        relatedScheduleTitle: options?.relatedScheduleTitle,
      });
      await refreshDashboard();
    },
    [refreshDashboard]
  );

  return { persistReview, refreshDashboard };
}
