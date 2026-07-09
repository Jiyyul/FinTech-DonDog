import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getServerSession();
  if (!session) {
    return NextResponse.json({ session: null }, { status: 401 });
  }
  return NextResponse.json({ session });
}
