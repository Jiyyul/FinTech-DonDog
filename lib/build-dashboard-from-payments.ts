import { CATEGORY_COLORS } from "@/lib/chart-colors";
import { classifyPayment, type StoredClassification } from "@/lib/classify-payments";
import { enrichTrendWithMoM } from "@/lib/dashboard-utils";
import { detectPaymentAnomalies, toAuditAnomalyQueue } from "@/lib/anomalies/from-payments";
import type {
  ActivityItem,
  AIReportSummary,
  AuditAnomaly,
  BudgetCategorySlice,
  CalendarEvent,
  DashboardTransaction,
  MonthlyBudgetPoint,
  TransactionStatus,
} from "@/lib/dashboard-types";
import type { PaymentRecord } from "@/lib/payment-types";

const AMOUNT_THRESHOLD = 300_000;
const BUDGET_CAP = 1_200_000;

function formatDateLabel(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}

function inferStatus(amount: number, confidence: number): TransactionStatus {
  if (amount >= AMOUNT_THRESHOLD) return "review";
  if (confidence < 80) return "review";
  return "completed";
}

function paymentToTransaction(
  record: PaymentRecord,
  classificationMap: Map<number, StoredClassification>
): DashboardTransaction {
  const date = record.transactedAt;
  const { category, confidence } = classifyPayment(
    record.id,
    record.merchant,
    classificationMap
  );
  const status = inferStatus(record.amount, confidence);

  return {
    id: `tx-${String(record.id).padStart(3, "0")}`,
    merchant: record.merchant,
    category,
    date,
    dateLabel: formatDateLabel(date),
    amount: record.amount,
    balance: record.balance,
    status,
    paymentMethod: record.paymentMethod,
    transactionId: `TX-${date.replace(/-/g, "")}-${String(record.id).padStart(3, "0")}`,
    hasReceipt: record.amount < 30_000,
    aiConfidence: confidence,
  };
}

export function buildTransactionsFromPayments(
  payments: PaymentRecord[],
  classificationMap: Map<number, StoredClassification>
): DashboardTransaction[] {
  return payments.map((record) => paymentToTransaction(record, classificationMap));
}

export function buildAllTransactions(
  payments: PaymentRecord[],
  classificationMap: Map<number, StoredClassification>
): DashboardTransaction[] {
  return [...buildTransactionsFromPayments(payments, classificationMap)].reverse();
}

function sumByCategory(transactions: DashboardTransaction[]) {
  const map = new Map<string, number>();
  for (const tx of transactions) {
    map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount);
  }
  return map;
}

export function buildBudgetSlices(
  transactions: DashboardTransaction[]
): BudgetCategorySlice[] {
  const totals = sumByCategory(transactions);
  const totalUsed = [...totals.values()].reduce((s, v) => s + v, 0);

  return [...totals.entries()]
    .map(([category, amount]) => ({
      category: category as BudgetCategorySlice["category"],
      percent: totalUsed > 0 ? Math.round((amount / totalUsed) * 100) : 0,
      amount,
      color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS],
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildAnomalyQueue(
  transactions: DashboardTransaction[]
): AuditAnomaly[] {
  // back_receipt의 규칙기반 감지 엔진(예산초과·중복결제·일정불일치·고액지출·영수증누락)을
  // 실제 결제내역에 적용한다 (lib/anomalies/from-payments.ts 어댑터 참고).
  const ruleResults = detectPaymentAnomalies(
    transactions,
    BUDGET_CAP,
    AMOUNT_THRESHOLD,
    CALENDAR_EVENTS
  );
  const anomalies = toAuditAnomalyQueue(ruleResults, transactions);

  // OpenAI 분류 신뢰도는 규칙 엔진에 없는 branch_openai 고유 신호이므로 별도로 유지한다.
  const lowConfidence = transactions.find((t) => (t.aiConfidence ?? 100) < 80);
  if (lowConfidence && !anomalies.some((a) => a.transaction.id === lowConfidence.id)) {
    anomalies.push({
      id: "ai-low-confidence",
      type: "low_confidence",
      transaction: lowConfidence,
      reason: "AI 분류 신뢰도가 80% 이하입니다. 카테고리를 확인해 주세요.",
      confidence: lowConfidence.aiConfidence ?? 72,
    });
  }

  return anomalies;
}

export function buildActivityFeed(
  transactions: DashboardTransaction[]
): ActivityItem[] {
  const recent = transactions.slice(0, 3);
  return recent.map((tx, i) => ({
    id: `act-${i + 1}`,
    time: i === 0 ? "3분 전" : i === 1 ? "12분 전" : "35분 전",
    message: `${tx.merchant}을(를) ${tx.category}(으)로 분류했습니다.`,
    hasDogIcon: true,
  }));
}

export function buildAiReportSummary(
  transactions: DashboardTransaction[],
  anomalyCount: number,
  currentBalance: number
): AIReportSummary {
  const slices = buildBudgetSlices(transactions);
  const food = slices.find((s) => s.category === "식비")?.percent ?? 0;
  const event =
    (slices.find((s) => s.category === "장소대여비")?.percent ?? 0) +
    (slices.find((s) => s.category === "행사비")?.percent ?? 0);

  return {
    confidence: 97,
    foodMoM: -4.2,
    eventMoM: 8.1,
    opsMoM: 2.3,
    overBudgetItems: event > 40 ? ["장소대여비"] : [],
    ruleViolations: transactions.filter((t) => t.amount >= AMOUNT_THRESHOLD).length,
    anomalyCount,
    lines: [
      `식비 비중 ${food}%입니다.`,
      `장소대여·행사 관련 지출 비중 ${event}%입니다.`,
      `이상 거래 ${anomalyCount}건이 감지되었습니다.`,
      `현재 계좌 잔액 ₩${currentBalance.toLocaleString()}입니다.`,
    ],
  };
}

export function buildMonthlyBudgetTrend(
  payments: PaymentRecord[],
  initialBalance: number
): MonthlyBudgetPoint[] {
  const byMonth = new Map<string, number>();
  const sorted = [...payments].sort((a, b) => a.transactedAt.localeCompare(b.transactedAt));

  for (const payment of sorted) {
    const month = Number(payment.transactedAt.slice(5, 7));
    const label = `${month}월`;
    byMonth.set(label, (byMonth.get(label) ?? 0) + payment.amount);
  }

  let runningBalance = initialBalance;
  const points: MonthlyBudgetPoint[] = [];

  for (const [month, used] of byMonth.entries()) {
    runningBalance -= used;
    points.push({
      month,
      used,
      budget: BUDGET_CAP,
      balance: runningBalance,
    });
  }

  return enrichTrendWithMoM(points);
}

export function buildBudgetStats(payments: PaymentRecord[], initialBalance: number, currentBalance: number) {
  const used = payments.reduce((sum, payment) => sum + payment.amount, 0);
  return {
    total: initialBalance,
    used,
    remaining: currentBalance,
    usagePercent: Math.round((used / initialBalance) * 100),
    usageSpeedPercent: 12,
    doughnutCenterPercent: 74,
  };
}

export const DOUGHNUT_CENTER_PERCENT = 74;
export const AMOUNT_THRESHOLD_EXPORT = AMOUNT_THRESHOLD;

export const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: "ev-1",
    title: "학생회 MT",
    date: 12,
    month: 7,
    year: 2026,
    color: CATEGORY_COLORS.장소대여비,
    description: "2박 3일 MT 일정",
  },
  {
    id: "ev-2",
    title: "정기 총회",
    date: 18,
    month: 7,
    year: 2026,
    color: CATEGORY_COLORS.운영비,
    description: "7월 정기 총회",
  },
  {
    id: "ev-3",
    title: "신입생 환영회",
    date: 25,
    month: 7,
    year: 2026,
    color: CATEGORY_COLORS.식비,
    description: "신입생 환영 행사",
  },
  {
    id: "ev-4",
    title: "예산 검토",
    date: 6,
    month: 7,
    year: 2026,
    color: CATEGORY_COLORS.교통비,
    description: "월간 예산 검토 회의",
  },
];

export const AI_CHAT_SUGGESTIONS = [
  "이번 MT 예산은 얼마 사용되었나요?",
  "이번 달 식비는 얼마인가요?",
  "가장 큰 지출은 무엇인가요?",
  "회칙 위반 거래가 있나요?",
];
