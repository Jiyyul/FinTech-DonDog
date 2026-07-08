import type { BudgetCategory } from "@/lib/dashboard-types";
import { OPENAI_CLASSIFY_CATEGORIES } from "@/lib/openai-classify";

export type StoredClassification = {
  paymentId: number;
  merchant: string;
  category: BudgetCategory;
  confidence: number;
  source?: string;
};

export function buildClassificationMap(
  rows: StoredClassification[]
): Map<number, StoredClassification> {
  return new Map(rows.map((row) => [row.paymentId, row]));
}

export function classifyPayment(
  paymentId: number,
  merchant: string,
  classificationMap: Map<number, StoredClassification>
): { category: BudgetCategory; confidence: number } {
  const stored = classificationMap.get(paymentId);
  if (stored) {
    return { category: stored.category, confidence: stored.confidence };
  }

  return { category: "기타", confidence: 0 };
}

export { OPENAI_CLASSIFY_CATEGORIES };
