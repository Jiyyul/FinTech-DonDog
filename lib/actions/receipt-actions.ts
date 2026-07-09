"use server";

import { revalidatePath } from "next/cache";
import { findDashboardTransaction } from "@/lib/get-dashboard-data";
import { convertReceiptToPayment, saveReceipt, updateReceipt } from "@/lib/receipt-repository";
import type { DashboardTransaction } from "@/lib/dashboard-types";
import type { ParsedReceipt, Receipt } from "@/lib/receipts/receipt-types";

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
  const receipt = await saveReceipt({
    ...parsed,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    imageDataUrl,
    linkedTransactionId,
  });
  revalidateReceiptPaths();

  const transaction = receipt.linkedTransactionId
    ? await findDashboardTransaction(receipt.linkedTransactionId)
    : null;

  return { receipt, transaction };
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
