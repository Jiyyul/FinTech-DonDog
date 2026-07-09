"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { prependActivity } from "@/lib/activity-feed";
import type { ActivityIcon, ActivityItem } from "@/lib/dashboard-types";
import type { DashboardData } from "@/lib/get-dashboard-data";

type DashboardDataContextValue = DashboardData & {
  logActivity: (
    message: string,
    options?: { hasDogIcon?: boolean; icon?: ActivityIcon }
  ) => void;
};

const DashboardDataContext = createContext<DashboardDataContextValue | null>(null);

export function DashboardDataProvider({
  data,
  children,
}: {
  data: DashboardData;
  children: React.ReactNode;
}) {
  const [activityFeed, setActivityFeed] = useState(data.activityFeed);

  useEffect(() => {
    setActivityFeed(data.activityFeed);
  }, [data.activityFeed]);

  const logActivity = useCallback(
    (message: string, options?: { hasDogIcon?: boolean; icon?: ActivityIcon }) => {
      setActivityFeed((prev) => prependActivity(prev, message, options));
    },
    []
  );

  const value = useMemo(
    () => ({
      ...data,
      activityFeed,
      logActivity,
    }),
    [data, activityFeed, logActivity]
  );

  return (
    <DashboardDataContext.Provider value={value}>{children}</DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error("useDashboardData는 DashboardDataProvider 안에서만 사용할 수 있습니다.");
  }
  return context;
}
