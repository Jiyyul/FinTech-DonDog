import "server-only";

import { getAllPayments, getClassifications } from "@/lib/payment-repository";
import { getLinkedPaymentIds } from "@/lib/receipt-repository";
import { buildTransactionsFromPayments } from "@/lib/build-dashboard-from-payments";
import { buildClassificationMap } from "@/lib/classify-payments";
import { getBudgetCategories, getBudgetHistory, getBudgetTotal, type BudgetHistoryItem } from "@/lib/budget-repository";
import { CATEGORY_COLORS } from "@/lib/chart-colors";
import type { BudgetCategory } from "@/lib/dashboard-types";

export type CategoryBudgetView = {
  category: BudgetCategory;
  budget: number;
  used: number;
  color: string;
};

export type BudgetPageData = {
  totalBudget: number;
  totalUsed: number;
  categories: CategoryBudgetView[];
  history: BudgetHistoryItem[];
  months: string[];
  monthlyByCategory: Record<string, number[]>;
};

function monthLabel(date: string): string {
  return `${Number(date.slice(5, 7))}월`;
}

export async function getBudgetData(): Promise<BudgetPageData> {
  const [payments, classifications, linkedPaymentIds, totalBudget, categoryBudgets, history] =
    await Promise.all([
      getAllPayments(),
      getClassifications(),
      getLinkedPaymentIds(),
      getBudgetTotal(),
      getBudgetCategories(),
      getBudgetHistory(),
    ]);

  const classificationMap = buildClassificationMap(classifications);
  const transactions = buildTransactionsFromPayments(payments, classificationMap, linkedPaymentIds);

  const usedByCategory = new Map<string, number>();
  for (const tx of transactions) {
    usedByCategory.set(tx.category, (usedByCategory.get(tx.category) ?? 0) + tx.amount);
  }

  const categories: CategoryBudgetView[] = Object.entries(categoryBudgets).map(
    ([category, budget]) => ({
      category: category as BudgetCategory,
      budget,
      used: usedByCategory.get(category) ?? 0,
      color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS],
    })
  );

  const totalUsed = transactions.reduce((sum, t) => sum + t.amount, 0);

  const monthsSet = new Set(transactions.map((t) => monthLabel(t.date)));
  const months = [...monthsSet].sort(
    (a, b) => Number(a.replace("월", "")) - Number(b.replace("월", ""))
  );

  const monthlyByCategory: Record<string, number[]> = {
    전체: months.map(
      (month) =>
        Math.round(
          transactions
            .filter((t) => monthLabel(t.date) === month)
            .reduce((sum, t) => sum + t.amount, 0) / 10_000
        )
    ),
  };
  for (const category of Object.keys(categoryBudgets)) {
    monthlyByCategory[category] = months.map(
      (month) =>
        Math.round(
          transactions
            .filter((t) => monthLabel(t.date) === month && t.category === category)
            .reduce((sum, t) => sum + t.amount, 0) / 10_000
        )
    );
  }

  return {
    totalBudget,
    totalUsed,
    categories,
    history,
    months,
    monthlyByCategory,
  };
}
