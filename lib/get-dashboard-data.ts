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
import { getBudgetTotal } from "@/lib/budget-repository";
import { getReviewStatusMap } from "@/lib/review-repository";
import { getLinkedPaymentIds, getReceipts } from "@/lib/receipt-repository";
import { getSchedules } from "@/lib/schedule-repository";
import type { Receipt } from "@/lib/receipts/receipt-types";

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
  receipts: Receipt[];
  aiReportSummary: AIReportSummary;
  activityFeed: ActivityItem[];
  monthlyBudgetTrend: MonthlyBudgetPoint[];
  calendarEvents: CalendarEvent[];
  aiChatSuggestions: string[];
  currentAccountBalance: number;
  aiChatResponses: Record<string, string>;
};

export async function getDashboardData(): Promise<DashboardData> {
  const [
    payments,
    classifications,
    budgetTotal,
    reviewStatusMap,
    linkedPaymentIds,
    balances,
    calendarEvents,
    receipts,
  ] = await Promise.all([
    getAllPayments(),
    getClassifications(),
    getBudgetTotal(),
    getReviewStatusMap(),
    getLinkedPaymentIds(),
    getAccountBalances(),
    getSchedules(),
    getReceipts(),
  ]);

  const classificationMap = buildClassificationMap(classifications);
  const { initial, current } = balances;

  const transactions = buildTransactionsFromPayments(payments, classificationMap, linkedPaymentIds);
  const allTx = buildAllTransactions(payments, classificationMap, linkedPaymentIds);
  const anomalies = buildAnomalyQueue(transactions, budgetTotal, calendarEvents, reviewStatusMap);
  const pendingIds = new Set(anomalies.map((a) => a.transaction.id));
  const budgetStats = buildBudgetStats(transactions, budgetTotal, pendingIds);
  const slices = buildBudgetSlices(transactions);
  const report = buildAiReportSummary(transactions, anomalies.length, current);
  const activity = buildActivityFeed(transactions);
  const monthlyTrend = buildMonthlyBudgetTrend(payments, budgetTotal, initial);

  const pendingAuditTransaction =
    transactions.find((t) => t.status === "review") ?? transactions[0];

  const largest = [...allTx].sort((a, b) => b.amount - a.amount)[0];
  const julyFoodTotal = allTx
    .filter((t) => t.category === "식비" && t.date.startsWith("2026-07"))
    .reduce((sum, t) => sum + t.amount, 0);
  const mtTotal = allTx
    .filter((t) => t.merchant.includes("MT") || t.merchant.includes("펜션"))
    .reduce((sum, t) => sum + t.amount, 0);

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
    receipts,
    aiReportSummary: report,
    activityFeed: [
      ...activity,
      {
        id: "act-4",
        time: "1시간 전",
        message: "AI 회계 리포트가 생성되었습니다.",
        hasDogIcon: true,
      },
    ],
    monthlyBudgetTrend: monthlyTrend,
    calendarEvents,
    aiChatSuggestions: AI_CHAT_SUGGESTIONS,
    currentAccountBalance: current,
    aiChatResponses: {
      "이번 MT 예산은 얼마 사용되었나요?": `이번 MT 관련 지출은 ₩${mtTotal.toLocaleString()}이에요. MT 펜션 예약 건이 검토 대기 중입니다.`,
      "이번 달 식비는 얼마인가요?": `이번 달 식비 합계는 ₩${julyFoodTotal.toLocaleString()}이에요.`,
      "가장 큰 지출은 무엇인가요?": largest
        ? `가장 큰 지출은 ${largest.merchant} ₩${largest.amount.toLocaleString()} (${largest.category})입니다.`
        : "지출 내역이 없습니다.",
      "회칙 위반 거래가 있나요?":
        anomalies.length > 0 && pendingAuditTransaction
          ? `이상 거래 ${anomalies.length}건이 있어요. ${pendingAuditTransaction.merchant} ₩${pendingAuditTransaction.amount.toLocaleString()} — 공동 승인이 필요합니다.`
          : "회칙 위반 가능 거래가 없습니다.",
    },
  };
}
