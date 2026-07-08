import { getDb } from "@/lib/db";
import type { AuditReviewRow, SaveAuditReviewInput } from "@/lib/audit-types";
import type { BudgetCategory } from "@/lib/dashboard-types";
import { saveClassifications } from "@/lib/payment-repository";

type AuditReviewDbRow = {
  payment_id: number;
  anomaly_type: string;
  review_status: string;
  category_override: string | null;
  related_schedule_id: string | null;
  related_schedule_title: string | null;
  reviewed_at: string;
};

function mapRow(row: AuditReviewDbRow): AuditReviewRow {
  return {
    paymentId: row.payment_id,
    anomalyType: row.anomaly_type as AuditReviewRow["anomalyType"],
    reviewStatus: row.review_status as AuditReviewRow["reviewStatus"],
    categoryOverride: (row.category_override as BudgetCategory | null) ?? undefined,
    relatedScheduleId: row.related_schedule_id ?? undefined,
    relatedScheduleTitle: row.related_schedule_title ?? undefined,
    reviewedAt: row.reviewed_at,
  };
}

export function getAllAuditReviews(): AuditReviewRow[] {
  const database = getDb();
  const rows = database
    .prepare(
      `SELECT payment_id, anomaly_type, review_status, category_override,
              related_schedule_id, related_schedule_title, reviewed_at
       FROM audit_reviews
       ORDER BY reviewed_at DESC`
    )
    .all() as AuditReviewDbRow[];

  return rows.map(mapRow);
}

export function saveAuditReview(input: SaveAuditReviewInput) {
  const database = getDb();

  const upsert = database.prepare(`
    INSERT INTO audit_reviews (
      payment_id, anomaly_type, review_status, category_override,
      related_schedule_id, related_schedule_title, reviewed_at
    ) VALUES (
      @paymentId, @anomalyType, @reviewStatus, @categoryOverride,
      @relatedScheduleId, @relatedScheduleTitle, datetime('now')
    )
    ON CONFLICT(payment_id, anomaly_type) DO UPDATE SET
      review_status = excluded.review_status,
      category_override = COALESCE(excluded.category_override, audit_reviews.category_override),
      related_schedule_id = COALESCE(excluded.related_schedule_id, audit_reviews.related_schedule_id),
      related_schedule_title = COALESCE(excluded.related_schedule_title, audit_reviews.related_schedule_title),
      reviewed_at = datetime('now')
  `);

  upsert.run({
    paymentId: input.paymentId,
    anomalyType: input.anomalyType,
    reviewStatus: input.reviewStatus,
    categoryOverride: input.categoryOverride ?? null,
    relatedScheduleId: input.relatedScheduleId ?? null,
    relatedScheduleTitle: input.relatedScheduleTitle ?? null,
  });

  if (input.categoryOverride) {
    saveClassifications([
      {
        paymentId: input.paymentId,
        category: input.categoryOverride,
        confidence: 100,
        source: "manual",
      },
    ]);
  }
}

export function saveManualCategory(paymentId: number, category: BudgetCategory) {
  saveClassifications([
    {
      paymentId,
      category,
      confidence: 100,
      source: "manual",
    },
  ]);
}
