import { getSupabase } from "@/lib/supabase";
import { buildCategoryBudgetsFromTotal } from "@/lib/group-budget";
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

export async function initializeGroupBudget(groupId: number, totalBudget: number): Promise<void> {
  const db = getSupabase();
  const categoryBudgets = buildCategoryBudgetsFromTotal(totalBudget);

  const { error: totalError } = await db
    .from("budget_total")
    .upsert({ group_id: groupId, amount: totalBudget }, { onConflict: "group_id" });
  if (totalError) throw new Error(`총 예산 초기화 실패: ${totalError.message}`);

  const rows = categoryBudgets.map((item) => ({
    group_id: groupId,
    category: item.category,
    budget_amount: item.budget,
  }));

  const { error: categoryError } = await db
    .from("budget_categories")
    .upsert(rows, { onConflict: "group_id,category" });
  if (categoryError) throw new Error(`카테고리 예산 초기화 실패: ${categoryError.message}`);
}

export async function getBudgetTotal(groupId: number): Promise<number> {
  const db = getSupabase();
  const { data, error } = await db
    .from("budget_total")
    .select("amount")
    .eq("group_id", groupId)
    .maybeSingle();
  if (error) throw new Error(`총 예산 조회 실패: ${error.message}`);
  return data?.amount ?? 0;
}

export async function getBudgetCategories(groupId: number): Promise<Record<string, number>> {
  const db = getSupabase();
  const { data, error } = await db
    .from("budget_categories")
    .select("category, budget_amount")
    .eq("group_id", groupId);
  if (error) throw new Error(`카테고리 예산 조회 실패: ${error.message}`);

  const map: Record<string, number> = {};
  for (const row of data ?? []) {
    map[row.category] = row.budget_amount;
  }
  return map;
}

export async function getBudgetHistory(groupId: number): Promise<BudgetHistoryItem[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("budget_history")
    .select("id, occurred_at, category, from_amount, to_amount, actor, type, label")
    .eq("group_id", groupId)
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

export async function setBudgetTotal(
  groupId: number,
  nextAmount: number,
  actor?: string
): Promise<void> {
  const db = getSupabase();
  const current = await getBudgetTotal(groupId);

  const { error: upsertError } = await db
    .from("budget_total")
    .upsert({ group_id: groupId, amount: nextAmount }, { onConflict: "group_id" });
  if (upsertError) throw new Error(`총 예산 저장 실패: ${upsertError.message}`);

  const { error: historyError } = await db.from("budget_history").insert({
    group_id: groupId,
    category: "총 예산",
    from_amount: current,
    to_amount: nextAmount,
    actor,
    type: "budget_change",
  });
  if (historyError) throw new Error(`예산 변경 이력 저장 실패: ${historyError.message}`);
}

export async function setCategoryBudget(
  groupId: number,
  category: BudgetCategory,
  nextAmount: number,
  actor?: string
): Promise<void> {
  const db = getSupabase();
  const categories = await getBudgetCategories(groupId);
  const current = categories[category] ?? 0;

  const { error: upsertError } = await db
    .from("budget_categories")
    .upsert(
      { group_id: groupId, category, budget_amount: nextAmount },
      { onConflict: "group_id,category" }
    );
  if (upsertError) throw new Error(`카테고리 예산 저장 실패: ${upsertError.message}`);

  const { error: historyError } = await db.from("budget_history").insert({
    group_id: groupId,
    category,
    from_amount: current,
    to_amount: nextAmount,
    actor,
    type: "budget_change",
  });
  if (historyError) throw new Error(`예산 변경 이력 저장 실패: ${historyError.message}`);
}

export async function seedBudgetDefaults(
  groupId: number,
  totalBudget: number,
  categoryBudgets: Record<string, number>
): Promise<void> {
  const existingTotal = await getBudgetTotal(groupId);
  if (existingTotal === 0) {
    await initializeGroupBudget(groupId, totalBudget);
    return;
  }

  const existingCategories = await getBudgetCategories(groupId);
  if (Object.keys(existingCategories).length === 0) {
    const db = getSupabase();
    const rows = Object.entries(categoryBudgets).map(([category, budget_amount]) => ({
      group_id: groupId,
      category,
      budget_amount,
    }));
    const { error } = await db
      .from("budget_categories")
      .upsert(rows, { onConflict: "group_id,category" });
    if (error) throw new Error(`카테고리 예산 시드 실패: ${error.message}`);
  }
}

export async function recordAiReviewHistory(
  groupId: number,
  category: string,
  label: string
): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("budget_history").insert({
    group_id: groupId,
    category,
    from_amount: 0,
    to_amount: 0,
    type: "ai_review",
    label,
  });
  if (error) throw new Error(`AI 검토 이력 저장 실패: ${error.message}`);
}
