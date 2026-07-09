import { CATEGORY_COLORS } from "@/lib/chart-colors";
import { classifyPayment, type StoredClassification } from "@/lib/classify-payments";
import { enrichTrendWithMoM } from "@/lib/dashboard-utils";
import { detectPaymentAnomalies, toAuditAnomalyQueue } from "@/lib/anomalies/from-payments";
import { paymentIdToTransactionId, transactionIdToPaymentId } from "@/lib/payment-types";
import type { ReviewStatus } from "@/lib/review-repository";
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
  classificationMap: Map<number, StoredClassification>,
  linkedPaymentIds: Set<number>
): DashboardTransaction {
  const date = record.transactedAt;
  const { category, confidence } = classifyPayment(
    record.id,
    record.merchant,
    classificationMap
  );
  const status = inferStatus(record.amount, confidence);

  return {
    id: paymentIdToTransactionId(record.id),
    merchant: record.merchant,
    category,
    date,
    dateLabel: formatDateLabel(date),
    amount: record.amount,
    balance: record.balance,
    status,
    paymentMethod: record.paymentMethod,
    transactionId: `TX-${date.replace(/-/g, "")}-${String(record.id).padStart(3, "0")}`,
    hasReceipt: linkedPaymentIds.has(record.id),
    aiConfidence: confidence,
  };
}

export function buildTransactionsFromPayments(
  payments: PaymentRecord[],
  classificationMap: Map<number, StoredClassification>,
  linkedPaymentIds: Set<number>
): DashboardTransaction[] {
  return payments.map((record) => paymentToTransaction(record, classificationMap, linkedPaymentIds));
}

export function buildAllTransactions(
  payments: PaymentRecord[],
  classificationMap: Map<number, StoredClassification>,
  linkedPaymentIds: Set<number>
): DashboardTransaction[] {
  return [...buildTransactionsFromPayments(payments, classificationMap, linkedPaymentIds)].reverse();
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

function isResolved(transactionId: string, reviewStatusMap: Map<number, ReviewStatus>): boolean {
  const paymentId = transactionIdToPaymentId(transactionId);
  if (paymentId == null) return false;
  const status = reviewStatusMap.get(paymentId);
  return status != null && status !== "pending";
}

export function buildAnomalyQueue(
  transactions: DashboardTransaction[],
  budgetTotal: number,
  calendarEvents: CalendarEvent[],
  reviewStatusMap: Map<number, ReviewStatus>
): AuditAnomaly[] {
  // back_receipt의 규칙기반 감지 엔진(예산초과·중복결제·일정불일치·영수증누락)을
  // 실제 결제내역에 적용한다 (lib/anomalies/from-payments.ts 어댑터 참고).
  const ruleResults = detectPaymentAnomalies(
    transactions,
    budgetTotal,
    AMOUNT_THRESHOLD,
    calendarEvents
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
    });
  }

  // 이미 승인/이월/예외처리로 검토가 끝난 거래는 대기 큐에서 제외한다.
  return anomalies.filter((a) => !isResolved(a.transaction.id, reviewStatusMap));
}

export function buildActivityFeed(
  transactions: DashboardTransaction[]
): ActivityItem[] {
  const recent = transactions.slice(0, 3);
  return recent.map((tx, i) => ({
    id: `act-${i + 1}`,
    time: tx.dateLabel,
    message: `${tx.merchant}을(를) ${tx.category}(으)로 분류했습니다.`,
    hasDogIcon: true,
  }));
}

function monthOf(date: string): string {
  return date.slice(0, 7);
}

function sumForMonth(
  transactions: DashboardTransaction[],
  month: string,
  categories?: string[]
): number {
  return transactions
    .filter((t) => monthOf(t.date) === month && (!categories || categories.includes(t.category)))
    .reduce((sum, t) => sum + t.amount, 0);
}

/** 직전 달 대비 변화율(%). 비교할 이전 달 데이터가 없으면 null. */
function computeMoM(transactions: DashboardTransaction[], categories?: string[]): number | null {
  const months = [...new Set(transactions.map((t) => monthOf(t.date)))].sort();
  if (months.length < 2) return null;

  const latest = months[months.length - 1];
  const prev = months[months.length - 2];
  const prevTotal = sumForMonth(transactions, prev, categories);
  const latestTotal = sumForMonth(transactions, latest, categories);

  if (prevTotal === 0) return latestTotal > 0 ? 100 : 0;
  return Math.round(((latestTotal - prevTotal) / prevTotal) * 1000) / 10;
}

export function buildAiReportSummary(
  transactions: DashboardTransaction[],
  anomalies: AuditAnomaly[],
  currentBalance: number,
  categoryBudgets: Record<string, number>
): AIReportSummary {
  const slices = buildBudgetSlices(transactions);
  const food = slices.find((s) => s.category === "식비")?.percent ?? 0;
  const event =
    (slices.find((s) => s.category === "장소대여비")?.percent ?? 0) +
    (slices.find((s) => s.category === "행사비")?.percent ?? 0);

  const confidences = transactions
    .map((t) => t.aiConfidence)
    .filter((c): c is number => c != null);
  const confidence = confidences.length
    ? Math.round(confidences.reduce((sum, c) => sum + c, 0) / confidences.length)
    : 0;

  const totalMoM = computeMoM(transactions);
  const foodMoM = computeMoM(transactions, ["식비"]);
  const eventMoM = computeMoM(transactions, ["행사비", "장소대여비"]);
  const opsMoM = computeMoM(transactions, ["운영비"]);
  const trafficMoM = computeMoM(transactions, ["교통비"]);

  const overBudgetItems = slices
    .filter((s) => (categoryBudgets[s.category] ?? 0) > 0 && s.amount > categoryBudgets[s.category])
    .map((s) => s.category);

  const ruleViolations = anomalies.filter((a) => a.type === "rule_violation").length;
  const coApprovalRequired = anomalies.filter((a) => a.type === "amount_threshold").length;

  const recommendations: string[] = [];
  if (overBudgetItems.length > 0) {
    recommendations.push(
      `${overBudgetItems.join(", ")} 예산을 초과했어요. 지출 속도를 조절하는 것을 추천합니다.`
    );
  }
  if (coApprovalRequired > 0) {
    recommendations.push(`공동 승인이 필요한 거래가 ${coApprovalRequired}건 있습니다.`);
  }
  const growthEntries: Array<[string, number | null]> = [
    ["식비", foodMoM],
    ["행사비", eventMoM],
    ["운영비", opsMoM],
    ["교통비", trafficMoM],
  ];
  const shrinking = growthEntries.filter(
    (entry): entry is [string, number] => entry[1] != null && entry[1] < 0
  );
  if (shrinking.length > 0) {
    const [label] = shrinking.reduce((min, cur) => (cur[1] < min[1] ? cur : min));
    recommendations.push(`${label} 지출은 전달보다 줄어 여유가 있는 편입니다.`);
  }
  if (recommendations.length === 0) {
    recommendations.push("현재 특별한 예산 위험 신호는 없습니다.");
  }

  return {
    confidence,
    totalMoM,
    foodMoM,
    eventMoM,
    opsMoM,
    trafficMoM,
    overBudgetItems,
    ruleViolations,
    coApprovalRequired,
    anomalyCount: anomalies.length,
    recommendations,
    lines: [
      `식비 비중 ${food}%입니다.`,
      `장소대여·행사 관련 지출 비중 ${event}%입니다.`,
      `이상 거래 ${anomalies.length}건이 감지되었습니다.`,
      `현재 계좌 잔액 ₩${currentBalance.toLocaleString()}입니다.`,
    ],
  };
}

export function buildMonthlyBudgetTrend(
  payments: PaymentRecord[],
  budgetTotal: number,
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
      budget: budgetTotal,
      balance: runningBalance,
    });
  }

  return enrichTrendWithMoM(points);
}

export function buildBudgetStats(
  transactions: DashboardTransaction[],
  budgetTotal: number,
  pendingTransactionIds: Set<string>
) {
  const committed = transactions.filter((t) => !pendingTransactionIds.has(t.id));
  const pending = transactions.filter((t) => pendingTransactionIds.has(t.id));

  const used = committed.reduce((sum, t) => sum + t.amount, 0);
  const pendingUsed = pending.reduce((sum, t) => sum + t.amount, 0);
  const remaining = budgetTotal - used;

  const usagePercent = budgetTotal > 0 ? Math.round((used / budgetTotal) * 100) : 0;

  return {
    total: budgetTotal,
    used,
    pendingUsed,
    remaining,
    usagePercent,
    // TODO: "지난달 같은 기간 대비 사용 속도"를 계산하려면 월별 이력 비교가 필요하다.
    // 지금은 월별 결제 데이터가 충분치 않아 임시로 0(비교 없음)으로 둔다.
    usageSpeedPercent: 0,
    doughnutCenterPercent: usagePercent,
  };
}

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
