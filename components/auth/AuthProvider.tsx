"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthTab = "login" | "signup";

type AuthContextValue = {
  isOpen: boolean;
  tab: AuthTab;
  toast: string | null;
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
  setTab: (tab: AuthTab) => void;
  showToast: (message: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<AuthTab>("login");
  const [toast, setToast] = useState<string | null>(null);

  const openAuth = useCallback((nextTab: AuthTab = "login") => {
    setTab(nextTab);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
  }, []);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const value = useMemo(
    () => ({ isOpen, tab, toast, openAuth, closeAuth, setTab, showToast }),
    [isOpen, tab, toast, openAuth, closeAuth, showToast]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
