"use server";

import { revalidatePath } from "next/cache";
import { setReviewStatus } from "@/lib/review-repository";
import { recordAiReviewHistory } from "@/lib/budget-repository";
import { requireAccountantSession } from "@/lib/auth-server";
import { transactionIdToPaymentId } from "@/lib/payment-types";

function requirePaymentId(transactionId: string): number {
  const paymentId = transactionIdToPaymentId(transactionId);
  if (paymentId == null) {
    throw new Error(`잘못된 거래 id입니다: ${transactionId}`);
  }
  return paymentId;
}

function revalidateAuditPaths() {
  revalidatePath("/");
  revalidatePath("/audit");
  revalidatePath("/audit/overview");
  revalidatePath("/budget");
  revalidatePath("/transactions");
}

export async function approveAnomalyAction(
  transactionId: string,
  merchant?: string,
  category?: string
): Promise<void> {
  const session = requireAccountantSession();
  await setReviewStatus(requirePaymentId(transactionId), "approved");
  if (merchant) {
    await recordAiReviewHistory(session.groupId, category ?? "기타", `${merchant} — 검토 승인 완료`);
  }
  revalidateAuditPaths();
}

export async function deferAnomalyAction(transactionId: string): Promise<void> {
  requireAccountantSession();
  await setReviewStatus(requirePaymentId(transactionId), "deferred");
  revalidateAuditPaths();
}

export async function requestCoApprovalAction(
  transactionId: string,
  merchant?: string,
  category?: string
): Promise<void> {
  const session = requireAccountantSession();
  await setReviewStatus(requirePaymentId(transactionId), "approved", {
    note: "공동 승인 요청됨",
  });
  if (merchant) {
    await recordAiReviewHistory(
      session.groupId,
      category ?? "기타",
      `${merchant} — 공동 승인 요청 완료`
    );
  }
  revalidateAuditPaths();
}

export async function recordExceptionAction(
  transactionId: string,
  note?: string
): Promise<void> {
  requireAccountantSession();
  await setReviewStatus(requirePaymentId(transactionId), "exception", { note });
  revalidateAuditPaths();
}
