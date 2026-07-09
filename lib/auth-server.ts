import { cookies } from "next/headers";
import {
  AUTH_COOKIE_NAME,
  canEditSession,
  decodeSession,
  encodeSession,
} from "@/lib/auth-session";
import type { AuthSession } from "@/lib/auth-types";

export function getServerSession(): AuthSession | null {
  const value = cookies().get(AUTH_COOKIE_NAME)?.value;
  if (!value) return null;
  return decodeSession(value);
}

export function setSessionCookie(session: AuthSession) {
  cookies().set(AUTH_COOKIE_NAME, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // maxAge 없음 → 브라우저 세션 쿠키 (탭/브라우저 종료 시 만료)
  });
}

export function clearSessionCookie() {
  cookies().set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function requireAccountantSession() {
  const session = getServerSession();
  if (!canEditSession(session)) {
    throw new Error("UNAUTHORIZED");
  }
  return session!;
}

export function requireSession() {
  const session = getServerSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
