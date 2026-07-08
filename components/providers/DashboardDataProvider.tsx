"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { DashboardData } from "@/lib/get-dashboard-data";

type DashboardDataContextValue = {
  data: DashboardData;
  setData: (data: DashboardData) => void;
};

const DashboardDataContext = createContext<DashboardDataContextValue | null>(null);

export function DashboardDataProvider({
  data: initialData,
  children,
}: {
  data: DashboardData;
  children: React.ReactNode;
}) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const value = useMemo(() => ({ data, setData }), [data]);

  return (
    <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardData는 DashboardDataProvider 안에서만 사용할 수 있습니다.");
  }
  return context.data;
}

export function useDashboardDataMutator() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardDataMutator는 DashboardDataProvider 안에서만 사용할 수 있습니다.");
  }
  return context.setData;
}
