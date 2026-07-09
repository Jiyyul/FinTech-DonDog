import { getSupabase } from "@/lib/supabase";

export type ReviewStatus = "pending" | "approved" | "deferred" | "exception";

export async function getReviewStatusMap(groupId: number): Promise<Map<number, ReviewStatus>> {
  const db = getSupabase();
  const { data: payments, error: paymentsError } = await db
    .from("payments")
    .select("id")
    .eq("group_id", groupId);

  if (paymentsError) throw new Error(`결제 조회 실패: ${paymentsError.message}`);

  const paymentIds = (payments ?? []).map((row) => row.id);
  if (paymentIds.length === 0) return new Map();

  const { data, error } = await db
    .from("transaction_reviews")
    .select("payment_id, status")
    .in("payment_id", paymentIds);

  if (error) throw new Error(`검토 상태 조회 실패: ${error.message}`);

  return new Map((data ?? []).map((row) => [row.payment_id, row.status as ReviewStatus]));
}

export async function setReviewStatus(
  paymentId: number,
  status: ReviewStatus,
  options?: { reviewer?: string; note?: string }
): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("transaction_reviews").upsert(
    {
      payment_id: paymentId,
      status,
      reviewed_at: new Date().toISOString(),
      reviewer: options?.reviewer,
      note: options?.note,
    },
    { onConflict: "payment_id" }
  );
  if (error) throw new Error(`검토 상태 저장 실패: ${error.message}`);
}
