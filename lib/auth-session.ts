import { createHash } from "crypto";
import type { AuthSession } from "@/lib/auth-types";

export const AUTH_COOKIE_NAME = "dondok-auth";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

export function verifyPassword(password: string, passwordHash: string) {
  return hashPassword(password) === passwordHash;
}

export function encodeSession(session: AuthSession) {
  return Buffer.from(JSON.stringify(session), "utf-8").toString("base64url");
}

export function decodeSession(value: string): AuthSession | null {
  try {
    const json = Buffer.from(value, "base64url").toString("utf-8");
    const parsed = JSON.parse(json) as AuthSession;
    if (!parsed?.role || !parsed.groupId || !parsed.groupName || !parsed.entryCode) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function canEditSession(session: AuthSession | null | undefined) {
  return session?.role === "accountant";
}
