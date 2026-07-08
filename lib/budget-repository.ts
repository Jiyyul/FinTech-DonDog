import { getSupabase } from "@/lib/supabase";
import type { BudgetCategory } from "@/lib/dashboard-types";

export type BudgetHistoryItem = {
  id: string;
  date: string;
  category: string;
  from: number;
  to: number;
  actor?: string;
  type: "budget_change" | "ai_review";
  label?: string;
};

export async function getBudgetTotal(): Promise<number> {
  const db = getSupabase();
  const { data, error } = await db.from("budget_total").select("amount").eq("id", 1).maybeSingle();
  if (error) throw new Error(`총 예산 조회 실패: ${error.message}`);
  return data?.amount ?? 0;
}

export async function getBudgetCategories(): Promise<Record<string, number>> {
  const db = getSupabase();
  const { data, error } = await db
    .from("budget_categories")
    .select("category, budget_amount")
    .order("category", { ascending: true });
  if (error) throw new Error(`카테고리 예산 조회 실패: ${error.message}`);

  const map: Record<string, number> = {};
  for (const row of data ?? []) {
    map[row.category] = row.budget_amount;
  }
  return map;
}

export async function getBudgetHistory(): Promise<BudgetHistoryItem[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("budget_history")
    .select("id, occurred_at, category, from_amount, to_amount, actor, type, label")
    .order("occurred_at", { ascending: false });

  if (error) throw new Error(`예산 변경 이력 조회 실패: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: String(row.id),
    date: formatHistoryDate(row.occurred_at),
    category: row.category,
    from: row.from_amount,
    to: row.to_amount,
    actor: row.actor ?? undefined,
    type: row.type,
    label: row.label ?? undefined,
  }));
}

function formatHistoryDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export async function setBudgetTotal(nextAmount: number, actor?: string): Promise<void> {
  const db = getSupabase();
  const current = await getBudgetTotal();

  const { error: upsertError } = await db
    .from("budget_total")
    .upsert({ id: 1, amount: nextAmount }, { onConflict: "id" });
  if (upsertError) throw new Error(`총 예산 저장 실패: ${upsertError.message}`);

  const { error: historyError } = await db.from("budget_history").insert({
    category: "총 예산",
    from_amount: current,
    to_amount: nextAmount,
    actor,
    type: "budget_change",
  });
  if (historyError) throw new Error(`예산 변경 이력 저장 실패: ${historyError.message}`);
}

export async function setCategoryBudget(
  category: BudgetCategory,
  nextAmount: number,
  actor?: string
): Promise<void> {
  const db = getSupabase();
  const categories = await getBudgetCategories();
  const current = categories[category] ?? 0;

  const { error: upsertError } = await db
    .from("budget_categories")
    .upsert({ category, budget_amount: nextAmount }, { onConflict: "category" });
  if (upsertError) throw new Error(`카테고리 예산 저장 실패: ${upsertError.message}`);

  const { error: historyError } = await db.from("budget_history").insert({
    category,
    from_amount: current,
    to_amount: nextAmount,
    actor,
    type: "budget_change",
  });
  if (historyError) throw new Error(`예산 변경 이력 저장 실패: ${historyError.message}`);
}

/** 시드 스크립트 전용: 이력 기록 없이 초기 예산 값만 채운다. 이미 값이 있으면 건드리지 않는다. */
export async function seedBudgetDefaults(
  totalBudget: number,
  categoryBudgets: Record<string, number>
): Promise<void> {
  const db = getSupabase();

  const existingTotal = await getBudgetTotal();
  if (existingTotal === 0) {
    const { error } = await db.from("budget_total").upsert({ id: 1, amount: totalBudget });
    if (error) throw new Error(`총 예산 시드 실패: ${error.message}`);
  }

  const existingCategories = await getBudgetCategories();
  if (Object.keys(existingCategories).length === 0) {
    const rows = Object.entries(categoryBudgets).map(([category, budget_amount]) => ({
      category,
      budget_amount,
    }));
    const { error } = await db.from("budget_categories").upsert(rows, { onConflict: "category" });
    if (error) throw new Error(`카테고리 예산 시드 실패: ${error.message}`);
  }
}

export async function recordAiReviewHistory(category: string, label: string): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("budget_history").insert({
    category,
    from_amount: 0,
    to_amount: 0,
    type: "ai_review",
    label,
  });
  if (error) throw new Error(`AI 검토 이력 저장 실패: ${error.message}`);
}
