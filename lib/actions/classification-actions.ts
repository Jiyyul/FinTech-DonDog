"use server";

import { revalidatePath } from "next/cache";
import { saveClassifications } from "@/lib/payment-repository";
import { transactionIdToPaymentId } from "@/lib/payment-types";
import type { BudgetCategory } from "@/lib/dashboard-types";

function revalidateClassificationPaths() {
  revalidatePath("/");
  revalidatePath("/audit");
  revalidatePath("/audit/overview");
  revalidatePath("/transactions");
  revalidatePath("/budget");
}

/**
 * 사용자가 수동으로 카테고리를 수정하면(예: 기타 → 식비) OpenAI 분류 결과를 덮어쓰고
 * source를 "manual"로 표시한다. 예산 사용률(budgetSlices)이 lib/get-dashboard-data.ts에서
 * 이 테이블을 다시 읽어 계산되므로, 여기서 저장만 하면 % 반영은 자동으로 따라온다.
 */
export async function updateTransactionCategoryAction(
  transactionId: string,
  category: BudgetCategory
): Promise<void> {
  const paymentId = transactionIdToPaymentId(transactionId);
  if (paymentId == null) {
    throw new Error(`잘못된 거래 id입니다: ${transactionId}`);
  }

  await saveClassifications([{ paymentId, category, confidence: 100, source: "manual" }]);
  revalidateClassificationPaths();
}
