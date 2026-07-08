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
  pendingAuditTransaction: DashboardTransaction;
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

export async function getDashboardData(): Promise<DashboardData> {
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
    getAllPayments(),
    getClassifications(),
    getBudgetTotal(),
    getBudgetCategories(),
    getReviewStatusMap(),
    getLinkedPaymentIds(),
    getAccountBalances(),
    getSchedules(),
  ]);

  const classificationMap = buildClassificationMap(classifications);
  const { initial, current } = balances;

  const transactions = buildTransactionsFromPayments(payments, classificationMap, linkedPaymentIds);
  const allTx = buildAllTransactions(payments, classificationMap, linkedPaymentIds);
  const anomalies = buildAnomalyQueue(transactions, budgetTotal, calendarEvents, reviewStatusMap);
  const pendingIds = new Set(anomalies.map((a) => a.transaction.id));
  const budgetStats = buildBudgetStats(transactions, budgetTotal, pendingIds);
  const slices = buildBudgetSlices(transactions);
  const report = buildAiReportSummary(transactions, anomalies, current, categoryBudgets);
  const activity = buildActivityFeed(transactions);
  const monthlyTrend = buildMonthlyBudgetTrend(payments, budgetTotal, initial);

  const pendingAuditTransaction =
    transactions.find((t) => t.status === "review") ?? transactions[0];

  return {
    budgetTotal: budgetStats.total,
    budgetUsed: budgetStats.used,
    budgetPendingUsed: budgetStats.pendingUsed,
    budgetRemaining: budgetStats.remaining,
    budgetUsagePercent: budgetStats.usagePercent,
    budgetUsageSpeedPercent: budgetStats.usageSpeedPercent,
    amountThreshold: AMOUNT_THRESHOLD_EXPORT,
    doughnutCenterPercent: budgetStats.doughnutCenterPercent,
    budgetSlices: slices,
    pendingAuditTransaction,
    anomalyQueue: anomalies,
    recentTransactions: transactions.slice(0, 4),
    allTransactions: allTx,
    aiReportSummary: report,
    activityFeed: activity,
    monthlyBudgetTrend: monthlyTrend,
    calendarEvents,
    aiChatSuggestions: AI_CHAT_SUGGESTIONS,
    currentAccountBalance: current,
  };
}
