"use server";

import { revalidatePath } from "next/cache";
import { setBudgetTotal, setCategoryBudget } from "@/lib/budget-repository";
import { requireAccountantSession } from "@/lib/auth-server";
import type { BudgetCategory } from "@/lib/dashboard-types";

export async function updateTotalBudgetAction(nextAmount: number): Promise<void> {
  const session = requireAccountantSession();
  if (!Number.isFinite(nextAmount) || nextAmount <= 0) {
    throw new Error("총 예산은 0보다 큰 숫자여야 합니다.");
  }
  await setBudgetTotal(session.groupId, nextAmount, session.username);
  revalidatePath("/");
  revalidatePath("/budget");
}

export async function updateCategoryBudgetAction(
  category: BudgetCategory,
  nextAmount: number
): Promise<void> {
  const session = requireAccountantSession();
  if (!Number.isFinite(nextAmount) || nextAmount < 0) {
    throw new Error("카테고리 예산은 0 이상의 숫자여야 합니다.");
  }
  await setCategoryBudget(session.groupId, category, nextAmount, session.username);
  revalidatePath("/");
  revalidatePath("/budget");
}
