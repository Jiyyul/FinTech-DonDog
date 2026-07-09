import "server-only";

import {
  buildActivityFeed,
  buildAiReportSummary,
  buildAllTransactions,
  buildAnomalyQueue,
  buildBudgetSlices,
  buildBudgetStats,
  buildMonthlyBudgetTrend,
  buildTransactionsFromPayments,
  AI_CHAT_SUGGESTIONS,
  AMOUNT_THRESHOLD_EXPORT,
} from "@/lib/build-dashboard-from-payments";
import { buildClassificationMap } from "@/lib/classify-payments";
import type {
  ActivityItem,
  AIReportSummary,
  AuditAnomaly,
  BudgetCategorySlice,
  CalendarEvent,
  DashboardTransaction,
  MonthlyBudgetPoint,
} from "@/lib/dashboard-types";
import {
  getAccountBalances,
  getAllPayments,
  getClassifications,
} from "@/lib/payment-repository";
import { getBudgetCategories, getBudgetTotal } from "@/lib/budget-repository";
import { getReviewStatusMap } from "@/lib/review-repository";
import { getLinkedPaymentIds } from "@/lib/receipt-repository";
import { getSchedules } from "@/lib/schedule-repository";

export type DashboardData = {
  budgetTotal: number;
  budgetUsed: number;
  budgetPendingUsed: number;
  budgetRemaining: number;
  budgetUsagePercent: number;
  budgetUsageSpeedPercent: number;
  amountThreshold: number;
  doughnutCenterPercent: number;
  budgetSlices: BudgetCategorySlice[];
  pendingAuditTransaction: DashboardTransaction | null;
  anomalyQueue: AuditAnomaly[];
  recentTransactions: DashboardTransaction[];
  allTransactions: DashboardTransaction[];
  aiReportSummary: AIReportSummary;
  activityFeed: ActivityItem[];
  monthlyBudgetTrend: MonthlyBudgetPoint[];
  calendarEvents: CalendarEvent[];
  aiChatSuggestions: string[];
  currentAccountBalance: number;
};

export async function getDashboardData(groupId: number): Promise<DashboardData> {
  const [
    payments,
    classifications,
    budgetTotal,
    categoryBudgets,
    reviewStatusMap,
    linkedPaymentIds,
    balances,
    calendarEvents,
  ] = await Promise.all([
    getAllPayments(groupId),
    getClassifications(groupId),
    getBudgetTotal(groupId),
    getBudgetCategories(groupId),
    getReviewStatusMap(groupId),
    getLinkedPaymentIds(groupId),
    getAccountBalances(groupId),
    getSchedules(groupId),
  ]);

  const classificationMap = buildClassificationMap(classifications);
  const { initial, current } = balances;

  const transactions = buildTransactionsFromPayments(payments, classificationMap, linkedPaymentIds);
  const allTx = buildAllTransactions(payments, classificationMap, linkedPaymentIds);
  const anomalies = buildAnomalyQueue(transactions, budgetTotal, calendarEvents, reviewStatusMap);
  const pendingIds = new Set(anomalies.map((a) => a.transaction.id));
  const budgetStats = buildBudgetStats(transactions, budgetTotal, pendingIds);
  const committedTransactions = transactions.filter((t) => !pendingIds.has(t.id));
  const slices = buildBudgetSlices(committedTransactions);
  const report = buildAiReportSummary(transactions, anomalies, current, categoryBudgets);
  const activity = buildActivityFeed(transactions);
  const monthlyTrend = buildMonthlyBudgetTrend(payments, budgetTotal, initial);

  const pendingAuditTransaction =
    transactions.find((t) => t.status === "review") ?? transactions[0] ?? null;

  const hasPayments = payments.length > 0;

  return {
    budgetTotal: budgetStats.total,
    budgetUsed: budgetStats.used,
    budgetPendingUsed: budgetStats.pendingUsed,
    budgetRemaining: budgetStats.remaining,
    budgetUsagePercent: budgetStats.usagePercent,
    budgetUsageSpeedPercent: hasPayments ? budgetStats.usageSpeedPercent : 0,
    amountThreshold: AMOUNT_THRESHOLD_EXPORT,
    doughnutCenterPercent: budgetStats.doughnutCenterPercent,
    budgetSlices: slices,
    pendingAuditTransaction,
    anomalyQueue: anomalies,
    recentTransactions: transactions.slice(0, 4),
    allTransactions: allTx,
    aiReportSummary: report,
    activityFeed: hasPayments
      ? [
          ...activity,
          {
            id: "act-4",
            time: "1시간 전",
            message: "AI 회계 리포트가 생성되었습니다.",
            hasDogIcon: true,
          },
        ]
      : [],
    monthlyBudgetTrend: monthlyTrend,
    calendarEvents: hasPayments ? calendarEvents : [],
    aiChatSuggestions: AI_CHAT_SUGGESTIONS,
    currentAccountBalance: current,
  };
}
