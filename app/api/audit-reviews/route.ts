import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { saveAuditReview, saveManualCategory } from "@/lib/audit-repository";
import type { AuditReviewStatus } from "@/lib/audit-types";
import type { AnomalyType, BudgetCategory } from "@/lib/dashboard-types";

type RequestBody = {
  paymentId: number;
  anomalyType: AnomalyType;
  action: AuditReviewStatus | "category_change";
  category?: BudgetCategory;
  relatedScheduleId?: string;
  relatedScheduleTitle?: string;
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if (!body.paymentId || !body.anomalyType || !body.action) {
      return NextResponse.json({ error: "필수 값이 없습니다." }, { status: 400 });
    }

    if (body.action === "category_change") {
      if (!body.category) {
        return NextResponse.json({ error: "카테고리가 필요합니다." }, { status: 400 });
      }
      saveManualCategory(body.paymentId, body.category);
      revalidatePath("/", "layout");
      return NextResponse.json({ ok: true });
    }

    saveAuditReview({
      paymentId: body.paymentId,
      anomalyType: body.anomalyType,
      reviewStatus: body.action,
      categoryOverride: body.category,
      relatedScheduleId: body.relatedScheduleId,
      relatedScheduleTitle: body.relatedScheduleTitle,
    });

    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "저장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
