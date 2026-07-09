import { NextResponse } from "next/server";
import { switchAccountantGroup } from "@/lib/auth-repository";
import { requireAccountantSession, setSessionCookie } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = requireAccountantSession();
    const body = (await request.json()) as { groupId?: number };
    const groupId = Number(body.groupId);

    if (!Number.isFinite(groupId) || groupId <= 0) {
      return NextResponse.json({ error: "유효한 그룹을 선택하세요." }, { status: 400 });
    }

    const nextSession = await switchAccountantGroup(session.userId!, groupId);
    if (!nextSession) {
      return NextResponse.json({ error: "해당 그룹에 접근할 수 없습니다." }, { status: 403 });
    }

    setSessionCookie(nextSession);
    return NextResponse.json({ ok: true, session: nextSession });
  } catch {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
}
