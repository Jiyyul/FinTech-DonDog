import { NextResponse } from "next/server";
import { loginWithEntryCode } from "@/lib/auth-repository";
import { setSessionCookie } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { entryCode?: string };
    if (!body.entryCode?.trim()) {
      return NextResponse.json({ error: "입장 코드를 입력하세요." }, { status: 400 });
    }

    const session = await loginWithEntryCode(body.entryCode);
    if (!session) {
      return NextResponse.json({ error: "유효하지 않은 입장 코드입니다." }, { status: 401 });
    }

    setSessionCookie(session);
    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "입장 중 오류가 발생했습니다." }, { status: 500 });
  }
}
