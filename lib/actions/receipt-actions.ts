"use server";

import { revalidatePath } from "next/cache";
import { saveReceipt } from "@/lib/receipt-repository";
import type { ParsedReceipt, Receipt } from "@/lib/receipts/receipt-types";

function revalidateReceiptPaths() {
  revalidatePath("/");
  revalidatePath("/receipts");
  revalidatePath("/audit");
  revalidatePath("/audit/overview");
}

export async function saveReceiptAction(
  parsed: ParsedReceipt,
  file: { name: string; type: string; size: number },
  linkedTransactionId: string | null
): Promise<Receipt> {
  const receipt = await saveReceipt({
    ...parsed,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    linkedTransactionId,
  });
  revalidateReceiptPaths();
  return receipt;
}
