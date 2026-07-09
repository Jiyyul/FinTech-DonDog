import { NextResponse } from "next/server";
import { signupAccountant } from "@/lib/auth-repository";
import { setSessionCookie } from "@/lib/auth-server";
import type { SignupInput } from "@/lib/auth-types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupInput;

    if (
      !body.username ||
      !body.password ||
      !body.accountNumber ||
      !body.phone ||
      !body.groupName ||
      body.totalBudget == null
    ) {
      return NextResponse.json({ error: "필수 항목을 모두 입력하세요." }, { status: 400 });
    }

    if (body.password.length < 4) {
      return NextResponse.json({ error: "비밀번호는 4자 이상이어야 합니다." }, { status: 400 });
    }

    if (!Number.isFinite(body.totalBudget) || body.totalBudget <= 0) {
      return NextResponse.json({ error: "유효한 총 예산을 입력하세요." }, { status: 400 });
    }

    const { session, entryCode } = await signupAccountant(body);
    setSessionCookie(session);

    return NextResponse.json({ ok: true, entryCode, session });
  } catch (error) {
    const message = error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
