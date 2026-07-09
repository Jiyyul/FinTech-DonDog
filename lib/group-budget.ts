import type { BudgetCategory } from "@/lib/dashboard-types";

export type CategoryBudgetSetting = {
  category: BudgetCategory;
  budget: number;
};

export const DEFAULT_TOTAL_BUDGET = 2_500_000;

const CATEGORY_WEIGHTS: { category: BudgetCategory; weight: number }[] = [
  { category: "행사비", weight: 700 },
  { category: "식비", weight: 450 },
  { category: "운영비", weight: 350 },
  { category: "교통비", weight: 300 },
  { category: "장소대여비", weight: 300 },
  { category: "장비비", weight: 200 },
  { category: "홍보비", weight: 100 },
  { category: "기타", weight: 100 },
];

const WEIGHT_SUM = CATEGORY_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);

export function buildCategoryBudgetsFromTotal(totalBudget: number): CategoryBudgetSetting[] {
  let allocated = 0;
  return CATEGORY_WEIGHTS.map((item, index) => {
    const isLast = index === CATEGORY_WEIGHTS.length - 1;
    const budget = isLast
      ? totalBudget - allocated
      : Math.round((totalBudget * item.weight) / WEIGHT_SUM);
    allocated += budget;
    return { category: item.category, budget };
  });
}
