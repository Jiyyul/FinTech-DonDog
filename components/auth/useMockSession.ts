"use client";

import { useEffect, useState } from "react";
import { getMockSession, type MockSession } from "@/lib/mock-auth";

export function useMockSession() {
  const [session, setSession] = useState<MockSession | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setSession(getMockSession());
    sync();
    setHydrated(true);

    window.addEventListener("dondok-auth-change", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("dondok-auth-change", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  return { session, hydrated };
}
