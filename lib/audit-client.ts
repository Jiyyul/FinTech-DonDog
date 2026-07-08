import type { AnomalyType, BudgetCategory } from "@/lib/dashboard-types";
import type { AuditReviewStatus } from "@/lib/audit-types";

export function parsePaymentId(transactionId: string): number {
  const match = transactionId.match(/tx-(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export type AuditReviewRequest = {
  paymentId: number;
  anomalyType: AnomalyType;
  action: AuditReviewStatus | "category_change";
  category?: BudgetCategory;
  relatedScheduleId?: string;
  relatedScheduleTitle?: string;
};

export async function submitAuditReview(payload: AuditReviewRequest) {
  const res = await fetch("/api/audit-reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "검토 결과 저장에 실패했습니다.");
  }

  return res.json();
}
