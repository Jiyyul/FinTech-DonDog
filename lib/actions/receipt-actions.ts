"use server";

import { revalidatePath } from "next/cache";
import { convertReceiptToPayment, saveReceipt, updateReceipt } from "@/lib/receipt-repository";
import { updatePayment } from "@/lib/payment-repository";
import { transactionIdToPaymentId } from "@/lib/payment-types";
import { updateTransactionCategoryAction } from "@/lib/actions/classification-actions";
import type { ParsedReceipt, Receipt } from "@/lib/receipts/receipt-types";
import type { BudgetCategory } from "@/lib/dashboard-types";

function revalidateReceiptPaths() {
  revalidatePath("/");
  revalidatePath("/receipts");
  revalidatePath("/audit");
  revalidatePath("/audit/overview");
  revalidatePath("/transactions");
}

export async function saveReceiptAction(
  parsed: ParsedReceipt,
  file: { name: string; type: string; size: number },
  linkedTransactionId: string | null,
  imageDataUrl?: string | null
): Promise<Receipt> {
  const receipt = await saveReceipt({
    ...parsed,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    imageDataUrl,
    linkedTransactionId,
  });
  revalidateReceiptPaths();
  return receipt;
}

export async function updateReceiptAction(
  receiptId: string,
  patch: { merchant?: string; purchasedAt?: string; totalAmount?: number }
): Promise<Receipt> {
  const receipt = await updateReceipt(receiptId, patch);
  revalidateReceiptPaths();
  return receipt;
}

export async function convertReceiptToPaymentAction(receiptId: string): Promise<Receipt> {
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
