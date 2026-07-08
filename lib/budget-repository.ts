import { getDb } from "@/lib/db";
import type { BudgetCategory } from "@/lib/dashboard-types";

export type CategoryBudgetSetting = {
  category: BudgetCategory;
  budget: number;
};

export const DEFAULT_TOTAL_BUDGET = 2_500_000;

export const DEFAULT_CATEGORY_BUDGETS: CategoryBudgetSetting[] = [
  { category: "행사비", budget: 700_000 },
  { category: "식비", budget: 450_000 },
  { category: "운영비", budget: 350_000 },
  { category: "교통비", budget: 300_000 },
  { category: "장소대여비", budget: 300_000 },
  { category: "장비비", budget: 200_000 },
  { category: "홍보비", budget: 100_000 },
  { category: "기타", budget: 100_000 },
];

function seedDefaultsIfEmpty() {
  const database = getDb();
  const count = database
    .prepare("SELECT COUNT(*) AS count FROM budget_settings")
    .get() as { count: number };

  if (count.count > 0) return;

  const insert = database.prepare(
    "INSERT INTO budget_settings (category, budget_amount) VALUES (@category, @budget)"
  );

  const seed = database.transaction(() => {
    insert.run({ category: "total", budget: DEFAULT_TOTAL_BUDGET });
    for (const item of DEFAULT_CATEGORY_BUDGETS) {
      insert.run({ category: item.category, budget: item.budget });
    }
  });

  seed();
}

export function getTotalBudget(): number {
  seedDefaultsIfEmpty();
  const row = getDb()
    .prepare("SELECT budget_amount FROM budget_settings WHERE category = 'total'")
    .get() as { budget_amount: number } | undefined;

  return row?.budget_amount ?? DEFAULT_TOTAL_BUDGET;
}

export function getCategoryBudgets(): CategoryBudgetSetting[] {
  seedDefaultsIfEmpty();
  const rows = getDb()
    .prepare(
      `SELECT category, budget_amount
       FROM budget_settings
       WHERE category != 'total'
       ORDER BY category`
    )
    .all() as { category: string; budget_amount: number }[];

  if (rows.length === 0) return DEFAULT_CATEGORY_BUDGETS;

  return rows.map((row) => ({
    category: row.category as BudgetCategory,
    budget: row.budget_amount,
  }));
}

export function saveTotalBudget(amount: number) {
  seedDefaultsIfEmpty();
  getDb()
    .prepare(
      `INSERT INTO budget_settings (category, budget_amount) VALUES ('total', @amount)
       ON CONFLICT(category) DO UPDATE SET budget_amount = excluded.budget_amount`
    )
    .run({ amount });
}

export function saveCategoryBudgets(items: CategoryBudgetSetting[]) {
  seedDefaultsIfEmpty();
  const upsert = getDb().prepare(
    `INSERT INTO budget_settings (category, budget_amount) VALUES (@category, @budget)
     ON CONFLICT(category) DO UPDATE SET budget_amount = excluded.budget_amount`
  );

  const save = getDb().transaction((rows: CategoryBudgetSetting[]) => {
    for (const item of rows) {
      upsert.run({ category: item.category, budget: item.budget });
    }
  });

  save(items);
}
