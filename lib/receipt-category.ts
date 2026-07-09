import type { BudgetCategory } from "@/lib/dashboard-types";
import { OPENAI_CLASSIFY_CATEGORIES } from "@/lib/openai-classify";

export function normalizeReceiptCategory(category?: string | null): BudgetCategory {
  if (category && OPENAI_CLASSIFY_CATEGORIES.includes(category as BudgetCategory)) {
    return category as BudgetCategory;
  }
  return "기타";
}
