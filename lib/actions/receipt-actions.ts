"use server";

import { revalidatePath } from "next/cache";
import { saveReceipt } from "@/lib/receipt-repository";
import { requireAccountantSession } from "@/lib/auth-server";
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
  const session = requireAccountantSession();
  const receipt = await saveReceipt(session.groupId, {
    ...parsed,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    linkedTransactionId,
  });
  revalidateReceiptPaths();
  return receipt;
}
