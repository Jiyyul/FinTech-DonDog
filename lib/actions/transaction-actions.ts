"use server";

import { revalidatePath } from "next/cache";
import { createPayment, saveClassifications } from "@/lib/payment-repository";
import { paymentIdToTransactionId } from "@/lib/payment-types";
import { saveReceipt } from "@/lib/receipt-repository";
import { requireAccountantSession } from "@/lib/auth-server";
import type { BudgetCategory } from "@/lib/dashboard-types";

function revalidateTransactionPaths() {
  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/receipts");
  revalidatePath("/budget");
  revalidatePath("/audit");
}

export async function addManualTransactionAction(data: {
  merchant: string;
  amount: number;
  date: string;
  category: BudgetCategory;
  paymentMethod: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  imageDataUrl: string | null;
}): Promise<void> {
  const session = requireAccountantSession();
  const transactedAt = `${data.date}T12:00:00+09:00`;

  const payment = await createPayment(session.groupId, {
    merchant: data.merchant,
    amount: data.amount,
    transactedAt,
    paymentMethod: data.paymentMethod,
  });

  await saveClassifications([
    {
      paymentId: payment.id,
      category: data.category,
      confidence: 100,
      source: "manual",
    },
  ]);

  await saveReceipt(session.groupId, {
    merchant: data.merchant,
    purchasedAt: data.date,
    totalAmount: data.amount,
    paymentMethod: data.paymentMethod,
    category: data.category,
    rawText: "수동 등록",
    confidence: 100,
    items: [],
    fileName: data.fileName,
    fileType: data.fileType,
    fileSize: data.fileSize,
    imageDataUrl: data.imageDataUrl,
    linkedTransactionId: paymentIdToTransactionId(payment.id),
  });

  revalidateTransactionPaths();
}
