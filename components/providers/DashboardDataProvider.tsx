"use client";

import { createContext, useContext } from "react";
import type { DashboardData } from "@/lib/get-dashboard-data";

const DashboardDataContext = createContext<DashboardData | null>(null);

export function DashboardDataProvider({
  data,
  children,
}: {
  data: DashboardData;
  children: React.ReactNode;
}) {
  return (
    <DashboardDataContext.Provider value={data}>{children}</DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardData는 DashboardDataProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
