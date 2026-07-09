import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, decodeSession } from "@/lib/auth-session";

const PUBLIC_PATHS = ["/login", "/signup", "/landing"];

function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 루트 접속 시 이전 로그인 쿠키를 지우고 로그인 화면으로 보냄
  if (pathname === "/") {
    const response = NextResponse.redirect(new URL("/login", request.url));
    clearAuthCookie(response);
    return response;
  }

  if (
    PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`)) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/logo") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".svg")
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!cookie || !decodeSession(cookie)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
