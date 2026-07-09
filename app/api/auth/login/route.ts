import { NextResponse } from "next/server";
import { loginAccountant } from "@/lib/auth-repository";
import { setSessionCookie } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    if (!body.username || !body.password) {
      return NextResponse.json({ error: "아이디와 비밀번호를 입력하세요." }, { status: 400 });
    }

    const session = await loginAccountant(body.username, body.password);
    if (!session) {
      return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    setSessionCookie(session);
    return NextResponse.json({ ok: true, session });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "로그인 중 오류가 발생했습니다." }, { status: 500 });
  }
}
