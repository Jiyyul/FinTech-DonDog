import { NextResponse } from "next/server";
import {
  getAccountantProfile,
  updateAccountantProfile,
} from "@/lib/auth-repository";
import { requireAccountantSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = requireAccountantSession();
    const profile = await getAccountantProfile(session.userId!);
    if (!profile) {
      return NextResponse.json({ error: "프로필을 찾을 수 없습니다." }, { status: 404 });
    }
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 401 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = requireAccountantSession();
    const body = (await request.json()) as {
      phone?: string;
      accountNumber?: string;
      affiliation?: string;
      password?: string;
    };

    const profile = await updateAccountantProfile(session.userId!, {
      phone: body.phone,
      accountNumber: body.accountNumber,
      affiliation: body.affiliation,
      password: body.password,
    });

    if (!profile) {
      return NextResponse.json({ error: "프로필을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, profile });
  } catch (error) {
    const message = error instanceof Error ? error.message : "프로필 저장에 실패했습니다.";
    const status = message === "UNAUTHORIZED" ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
