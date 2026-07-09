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
import type { DashboardTransaction } from "@/lib/dashboard-types";

type DashboardDataContextValue = DashboardData & {
  logActivity: (
    message: string,
    options?: { hasDogIcon?: boolean; icon?: ActivityIcon }
  ) => void;
  prependTransaction: (transaction: DashboardTransaction) => void;
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

  const [pendingTransactions, setPendingTransactions] = useState<DashboardTransaction[]>([]);

  useEffect(() => {
    setPendingTransactions([]);
  }, [data]);

  const prependTransaction = useCallback((transaction: DashboardTransaction) => {
    setPendingTransactions((prev) => {
      if (prev.some((tx) => tx.id === transaction.id)) return prev;
      return [transaction, ...prev];
    });
  }, []);

  const value = useMemo<DashboardDataContextValue>(() => {
    const base = { ...data, activityFeed, logActivity, prependTransaction };

    if (pendingTransactions.length === 0) {
      return base;
    }

    const knownIds = new Set([
      ...data.allTransactions.map((tx) => tx.id),
      ...data.recentTransactions.map((tx) => tx.id),
    ]);
    const fresh = pendingTransactions.filter((tx) => !knownIds.has(tx.id));
    if (fresh.length === 0) {
      return base;
    }

    const allTransactions = [...data.allTransactions, ...fresh];
    const recentTransactions = [
      ...fresh,
      ...data.recentTransactions.filter((tx) => !fresh.some((item) => item.id === tx.id)),
    ].slice(0, 4);

    return {
      ...base,
      allTransactions,
      recentTransactions,
    };
  }, [data, activityFeed, logActivity, pendingTransactions, prependTransaction]);

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
