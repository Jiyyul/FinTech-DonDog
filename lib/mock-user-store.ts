import { CURRENT_USER, type Organization, type RegisteredCard } from "@/lib/mock-data";
import type { MockSession } from "@/lib/mock-auth";
import { getUserInitials } from "@/lib/mock-auth";

const STORAGE_KEY = "dondok-user-data";

export type StoredUserProfile = {
  name: string;
  birthDate: string;
  userId: string;
  role: string;
  card: RegisteredCard | null;
};

export type SignupProfile = {
  name: string;
  email: string;
  planId?: string;
  school?: string;
  club?: string;
};

type UserDataRecord = {
  organizations: Organization[];
  profile?: StoredUserProfile;
  signup?: SignupProfile;
};

type UserDataStore = Record<string, UserDataRecord>;

function readStore(): UserDataStore {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as UserDataStore;
  } catch {
    return {};
  }
}

function writeStore(store: UserDataStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event("dondok-user-data-change"));
}

function getRecord(userId: string): UserDataRecord {
  return readStore()[userId] ?? { organizations: [] };
}

function updateRecord(userId: string, patch: Partial<UserDataRecord>): void {
  const store = readStore();
  store[userId] = { ...getRecord(userId), ...patch };
  writeStore(store);
}

export function getUserOrganizations(userId: string): Organization[] {
  return getRecord(userId).organizations;
}

export function saveUserOrganizations(userId: string, organizations: Organization[]): void {
  updateRecord(userId, { organizations });
}

export function addUserOrganization(userId: string, organization: Organization): Organization[] {
  const current = getUserOrganizations(userId);
  const next = [...current, organization];
  saveUserOrganizations(userId, next);
  return next;
}

export function saveSignupProfile(email: string, signup: SignupProfile): void {
  const normalizedEmail = email.trim().toLowerCase();
  const userId = resolveUserIdByEmail(normalizedEmail);
  updateRecord(userId, { signup: { ...signup, email: normalizedEmail } });
}

export function applySignupProfileOnLogin(session: MockSession): void {
  if (session.accountType === "demo") return;

  const userId = session.user.id;
  const existing = getRecord(userId).profile;
  if (existing) return;

  const signup = getRecord(userId).signup;
  if (!signup) return;

  const emailPrefix = signup.email.split("@")[0] ?? "user";

  saveUserProfile(userId, {
    name: signup.name,
    birthDate: "",
    userId: emailPrefix,
    role: session.user.role,
    card: null,
  });
}

function resolveUserIdByEmail(email: string): string {
  if (email === "new@dondog.ai") return "new-user";
  if (email === "test@dondog.ai") return "demo-user";
  return `user-${email.replace(/[^a-z0-9]/gi, "-")}`;
}

export function getUserProfileData(userId: string): StoredUserProfile | null {
  return getRecord(userId).profile ?? null;
}

export function saveUserProfile(userId: string, profile: StoredUserProfile): void {
  updateRecord(userId, { profile });
}

function createEmptyProfile(session: MockSession): StoredUserProfile {
  const emailPrefix = session.user.email.split("@")[0] ?? "user";

  return {
    name: session.user.name,
    birthDate: "",
    userId: emailPrefix,
    role: session.user.role,
    card: null,
  };
}

export function resolveUserProfile(session: MockSession | null): StoredUserProfile | null {
  if (!session) return null;

  if (session.accountType === "demo") {
    return {
      name: CURRENT_USER.name,
      birthDate: CURRENT_USER.birthDate,
      userId: CURRENT_USER.userId,
      role: CURRENT_USER.role,
      card: CURRENT_USER.card,
    };
  }

  const stored = getUserProfileData(session.user.id);
  if (stored) return stored;

  return createEmptyProfile(session);
}

export function toDisplayProfile(profile: StoredUserProfile) {
  return {
    ...profile,
    initials: getUserInitials(profile.name),
  };
}

export function clearUserData(userId: string): void {
  const store = readStore();
  delete store[userId];
  writeStore(store);
}
