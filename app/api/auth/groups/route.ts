import { NextResponse } from "next/server";
import { createGroupForAccountant } from "@/lib/auth-repository";
import { requireAccountantSession, setSessionCookie } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = requireAccountantSession();
    const body = (await request.json()) as { groupName?: string; totalBudget?: number };

    if (!body.groupName?.trim()) {
      return NextResponse.json({ error: "동아리(모임)명을 입력하세요." }, { status: 400 });
    }

    const totalBudget = Number(body.totalBudget);
    if (!Number.isFinite(totalBudget) || totalBudget <= 0) {
      return NextResponse.json({ error: "유효한 총 예산을 입력하세요." }, { status: 400 });
    }

    const nextSession = await createGroupForAccountant(session.userId!, {
      groupName: body.groupName.trim(),
      totalBudget,
    });

    setSessionCookie(nextSession);
    return NextResponse.json({ ok: true, session: nextSession });
  } catch (error) {
    const message = error instanceof Error ? error.message : "그룹 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
