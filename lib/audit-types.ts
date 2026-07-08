import type { AnomalyType, BudgetCategory } from "@/lib/dashboard-types";

export type AuditReviewStatus =
  | "approved"
  | "deferred"
  | "exception"
  | "co_approved"
  | "co_approval_pending";

export type AuditReviewRow = {
  paymentId: number;
  anomalyType: AnomalyType;
  reviewStatus: AuditReviewStatus;
  categoryOverride?: BudgetCategory;
  relatedScheduleId?: string;
  relatedScheduleTitle?: string;
  reviewedAt: string;
};

export type SaveAuditReviewInput = {
  paymentId: number;
  anomalyType: AnomalyType;
  reviewStatus: AuditReviewStatus;
  categoryOverride?: BudgetCategory;
  relatedScheduleId?: string;
  relatedScheduleTitle?: string;
};
