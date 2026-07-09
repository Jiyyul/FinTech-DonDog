"use server";

import { revalidatePath } from "next/cache";
import { findDashboardTransaction } from "@/lib/get-dashboard-data";
import { convertReceiptToPayment, saveReceipt, updateReceipt } from "@/lib/receipt-repository";
import { updatePayment } from "@/lib/payment-repository";
import { transactionIdToPaymentId } from "@/lib/payment-types";
import { updateTransactionCategoryAction } from "@/lib/actions/classification-actions";
import { requireAccountantSession } from "@/lib/auth-server";
import type { DashboardTransaction } from "@/lib/dashboard-types";
import type { ParsedReceipt, Receipt } from "@/lib/receipts/receipt-types";
import type { BudgetCategory } from "@/lib/dashboard-types";

function revalidateReceiptPaths() {
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/receipts");
  revalidatePath("/audit");
  revalidatePath("/audit/overview");
  revalidatePath("/transactions");
}

export type SaveReceiptResult = {
  receipt: Receipt;
  transaction: DashboardTransaction | null;
};

export async function saveReceiptAction(
  parsed: ParsedReceipt,
  file: { name: string; type: string; size: number },
  linkedTransactionId: string | null,
  imageDataUrl?: string | null
): Promise<SaveReceiptResult> {
  const session = requireAccountantSession();
  const receipt = await saveReceipt(session.groupId, {
    ...parsed,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    imageDataUrl,
    linkedTransactionId,
  });
  revalidateReceiptPaths();

  const transaction = receipt.linkedTransactionId
    ? await findDashboardTransaction(session.groupId, receipt.linkedTransactionId)
    : null;

  return { receipt, transaction };
}

export async function updateReceiptAction(
  receiptId: string,
  patch: { merchant?: string; purchasedAt?: string; totalAmount?: number }
): Promise<Receipt> {
  requireAccountantSession();
  const receipt = await updateReceipt(receiptId, patch);
  revalidateReceiptPaths();
  return receipt;
}

export async function convertReceiptToPaymentAction(receiptId: string): Promise<Receipt> {
  requireAccountantSession();
  const receipt = await convertReceiptToPayment(receiptId);
  revalidateReceiptPaths();
  return receipt;
}

/** 영수증에 연결된 거래(payment) 자체의 거래처/거래일/금액/카테고리를 수정한다. */
export async function updateLinkedTransactionAction(
  transactionId: string,
  patch: { merchant?: string; transactedAt?: string; amount?: number; category?: BudgetCategory }
): Promise<void> {
  const paymentId = transactionIdToPaymentId(transactionId);
  if (paymentId == null) {
    throw new Error(`잘못된 거래 id입니다: ${transactionId}`);
  }

  const { category, ...paymentPatch } = patch;
  if (Object.keys(paymentPatch).length > 0) {
    await updatePayment(paymentId, paymentPatch);
  }
  if (category) {
    await updateTransactionCategoryAction(transactionId, category);
  }
  revalidateReceiptPaths();
}
