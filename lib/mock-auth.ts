export type MockAccountType = "demo" | "new";

export const MOCK_AUTH_STORAGE_KEY = "dondok-auth";

export const MOCK_LOGIN_ERROR = "이메일 또는 비밀번호가 올바르지 않습니다.";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type MockSession = {
  isLoggedIn: boolean;
  accountType: MockAccountType;
  user: MockUser;
};

const MOCK_ACCOUNTS: Record<
  MockAccountType,
  { email: string; password: string; user: MockUser }
> = {
  demo: {
    email: "test@dondog.ai",
    password: "1234",
    user: {
      id: "demo-user",
      name: "데모 사용자",
      email: "test@dondog.ai",
      role: "총무",
    },
  },
  new: {
    email: "new@dondog.ai",
    password: "1234",
    user: {
      id: "new-user",
      name: "신규 사용자",
      email: "new@dondog.ai",
      role: "owner",
    },
  },
};

export function resolveMockLogin(email: string, password: string): MockSession | null {
  const normalized = email.trim().toLowerCase();
  const entry = Object.entries(MOCK_ACCOUNTS).find(
    ([, account]) => account.email === normalized && account.password === password
  );

  if (!entry) return null;

  const [accountType, account] = entry as [MockAccountType, (typeof MOCK_ACCOUNTS)["demo"]];

  return {
    isLoggedIn: true,
    accountType,
    user: account.user,
  };
}

export function saveMockSession(session: MockSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("dondok-auth-change"));
}

export function clearMockSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("dondok-auth-change"));
}

export function getMockSession(): MockSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MockSession;
    if (!parsed.isLoggedIn || !parsed.user?.id) return null;

    if (!parsed.accountType) {
      const email = parsed.user.email?.toLowerCase() ?? "";
      parsed.accountType =
        email === "test@dondog.ai" || email === "demo@dondog.ai" ? "demo" : "new";
    }

    return parsed;
  } catch {
    return null;
  }
}

export function getUserInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  if (/[가-힣]/.test(trimmed)) {
    return trimmed.slice(0, 2);
  }
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
}
