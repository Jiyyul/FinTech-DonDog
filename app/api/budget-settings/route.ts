import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getCategoryBudgets,
  getTotalBudget,
  saveCategoryBudgets,
  saveTotalBudget,
  type CategoryBudgetSetting,
} from "@/lib/budget-repository";
import type { BudgetCategory } from "@/lib/dashboard-types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    totalBudget: getTotalBudget(),
    categoryBudgets: getCategoryBudgets(),
  });
}

type RequestBody = {
  totalBudget?: number;
  categoryBudgets?: { category: BudgetCategory; budget: number }[];
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (body.totalBudget != null) {
      if (Number.isNaN(body.totalBudget) || body.totalBudget <= 0) {
        return NextResponse.json({ error: "유효한 총 예산이 필요합니다." }, { status: 400 });
      }
      saveTotalBudget(body.totalBudget);
    }

    if (body.categoryBudgets?.length) {
      saveCategoryBudgets(body.categoryBudgets as CategoryBudgetSetting[]);
    }

    revalidatePath("/", "layout");
    return NextResponse.json({
      ok: true,
      totalBudget: getTotalBudget(),
      categoryBudgets: getCategoryBudgets(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
