"use server";

import { revalidatePath } from "next/cache";
import { convertReceiptToPayment, saveReceipt, updateReceipt } from "@/lib/receipt-repository";
import { requireAccountantSession } from "@/lib/auth-server";
import type { ParsedReceipt, Receipt } from "@/lib/receipts/receipt-types";

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
  return receipt;
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
