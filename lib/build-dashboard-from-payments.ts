import { CATEGORY_COLORS } from "@/lib/chart-colors";
import { classifyPayment, type StoredClassification } from "@/lib/classify-payments";
import { enrichTrendWithMoM } from "@/lib/dashboard-utils";
import type {
  ActivityItem,
  AIReportSummary,
  AuditAnomaly,
  BudgetCategorySlice,
  BudgetCategory,
  CalendarEvent,
  DashboardTransaction,
  MonthlyBudgetPoint,
  PaymentCalendarItem,
  TransactionStatus,
} from "@/lib/dashboard-types";
import type { PaymentRecord } from "@/lib/payment-types";
import type { AuditReviewRow } from "@/lib/audit-types";

const AMOUNT_THRESHOLD = 300_000;
const BUDGET_CAP = 1_200_000;

function formatDateLabel(date: string) {
  const [, month, day] = date.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}

function inferStatus(amount: number, confidence: number, isClassified: boolean): TransactionStatus {
  if (amount >= AMOUNT_THRESHOLD) return "review";
  if (isClassified && confidence < 80) return "review";
  return "completed";
}

function paymentToTransaction(
  record: PaymentRecord,
  classificationMap: Map<number, StoredClassification>,
  review?: AuditReviewRow
): DashboardTransaction {
  const date = record.transactedAt;
  const stored = classificationMap.get(record.id);
  let { category, confidence } = classifyPayment(
    record.id,
    record.merchant,
    classificationMap
  );

  if (review?.categoryOverride) {
    category = review.categoryOverride;
    confidence = 100;
  }

  const resolved =
    review &&
    ["approved", "exception", "co_approved"].includes(review.reviewStatus);

  let status = inferStatus(record.amount, confidence, Boolean(stored));
  if (resolved) {
    status = "completed";
  }

  return {
    id: `tx-${String(record.id).padStart(3, "0")}`,
    paymentId: record.id,
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
  classificationMap: Map<number, StoredClassification>,
  reviews: AuditReviewRow[] = []
): DashboardTransaction[] {
  const reviewByPayment = new Map<number, AuditReviewRow[]>();
  for (const review of reviews) {
    const list = reviewByPayment.get(review.paymentId) ?? [];
    list.push(review);
    reviewByPayment.set(review.paymentId, list);
  }

  return payments.map((record) => {
    const paymentReviews = reviewByPayment.get(record.id) ?? [];
    const categoryReview = paymentReviews.find((r) => r.categoryOverride);
    return paymentToTransaction(record, classificationMap, categoryReview);
  });
}

export function buildAllTransactions(
  payments: PaymentRecord[],
  classificationMap: Map<number, StoredClassification>,
  reviews: AuditReviewRow[] = []
): DashboardTransaction[] {
  return [...buildTransactionsFromPayments(payments, classificationMap, reviews)].reverse();
}

function sumByCategory(transactions: DashboardTransaction[]) {
  const map = new Map<string, number>();
  for (const tx of transactions) {
    map.set(tx.category, (map.get(tx.category) ?? 0) + tx.amount);
  }
  return map;
}

export function buildBudgetSlices(
  transactions: DashboardTransaction[],
  categoryBudgets: { category: BudgetCategory; budget: number }[] = []
): BudgetCategorySlice[] {
  const totals = sumByCategory(transactions);
  const budgetMap = new Map(categoryBudgets.map((item) => [item.category, item.budget]));
  const totalBudget = [...budgetMap.values()].reduce((sum, value) => sum + value, 0);

  const categories = new Set<BudgetCategory>([
    ...categoryBudgets.map((item) => item.category),
    ...([...totals.keys()] as BudgetCategory[]),
  ]);

  return [...categories]
    .map((category) => {
      const amount = totals.get(category) ?? 0;
      const budget = budgetMap.get(category) ?? 0;
      const percent =
        totalBudget > 0
          ? Math.round((budget / totalBudget) * 100)
          : amount > 0
            ? Math.round((amount / [...totals.values()].reduce((s, v) => s + v, 0)) * 100)
            : 0;

      return {
        category,
        percent,
        amount,
        color: CATEGORY_COLORS[category],
      };
    })
    .filter((slice) => slice.percent > 0 || slice.amount > 0)
    .sort((a, b) => b.amount - a.amount);
}

export function buildAnomalyQueue(
  transactions: DashboardTransaction[],
  reviews: AuditReviewRow[] = []
): {
  active: AuditAnomaly[];
  deferred: AuditAnomaly[];
  pendingCoApproval: AuditAnomaly[];
} {
  const reviewByKey = new Map(
    reviews.map((r) => [`${r.paymentId}:${r.anomalyType}`, r])
  );

  const candidates: AuditAnomaly[] = [];
  let idCounter = 1;
  const nextId = () => `anomaly-${idCounter++}`;

  for (const tx of transactions.filter((t) => t.amount >= AMOUNT_THRESHOLD)) {
    candidates.push({
      id: nextId(),
      type: "amount_threshold",
      transaction: tx,
      reason: `₩${AMOUNT_THRESHOLD.toLocaleString()}원 이상 결제로 공동 승인이 필요합니다.`,
      confidence: 99,
      ruleReference: "학생회 회칙 제3조 — 30만원 이상 결제는 공동 승인 필요",
    });
  }

  for (const tx of transactions.filter(
    (t) => (t.aiConfidence ?? 100) > 0 && (t.aiConfidence ?? 100) < 80
  )) {
    candidates.push({
      id: nextId(),
      type: "low_confidence",
      transaction: tx,
      reason: "AI 분류 신뢰도가 80% 이하입니다. 카테고리를 확인해 주세요.",
      confidence: tx.aiConfidence ?? 72,
    });
  }

  const mtEvent = CALENDAR_EVENTS.find((e) => e.id === "ev-1");
  for (const tx of transactions.filter((t) => {
    if (!mtEvent || !(t.merchant.includes("신라호텔") || t.merchant.includes("호텔"))) {
      return false;
    }
    const [year, month, day] = t.date.split("-").map(Number);
    return (
      year === mtEvent.year &&
      month === mtEvent.month &&
      day !== mtEvent.date
    );
  })) {
    candidates.push({
      id: nextId(),
      type: "schedule_mismatch",
      transaction: tx,
      reason:
        "학생회 MT 일정(7월 12일)이 등록되어 있으나, 호텔 결제 시점과 일정이 일치하지 않습니다.",
      confidence: 88,
      relatedSchedule: "학생회 MT",
      relatedScheduleId: "ev-1",
    });
  }

  for (const tx of transactions.filter(
    (t) =>
      t.category === "식비" &&
      (t.merchant.includes("노래방") ||
        t.merchant.includes("주점") ||
        t.merchant.includes("클럽"))
  )) {
    candidates.push({
      id: nextId(),
      type: "rule_violation",
      transaction: tx,
      reason: "학생회 회칙상 유흥업소·노래방 회식비는 식비로 처리할 수 없습니다.",
      confidence: 91,
      ruleReference: "학생회 회칙 제5조 — 유흥업소 지출 금지",
    });
  }

  const active: AuditAnomaly[] = [];
  const deferred: AuditAnomaly[] = [];
  const pendingCoApproval: AuditAnomaly[] = [];

  for (const anomaly of candidates) {
    const paymentId = anomaly.transaction.paymentId;
    const review = reviewByKey.get(`${paymentId}:${anomaly.type}`);

    if (!review) {
      active.push(anomaly);
      continue;
    }

    const enriched: AuditAnomaly = {
      ...anomaly,
      transaction: {
        ...anomaly.transaction,
        category: review.categoryOverride ?? anomaly.transaction.category,
        status: ["approved", "exception", "co_approved"].includes(review.reviewStatus)
          ? "completed"
          : anomaly.transaction.status,
      },
      relatedScheduleId: review.relatedScheduleId ?? anomaly.relatedScheduleId,
      relatedSchedule: review.relatedScheduleTitle ?? anomaly.relatedSchedule,
    };

    if (review.reviewStatus === "deferred") {
      deferred.push({ ...enriched, deferred: true });
    } else if (review.reviewStatus === "co_approval_pending") {
      pendingCoApproval.push({ ...enriched, coApprovalPending: true });
    }
  }

  return { active, deferred, pendingCoApproval };
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

export function buildPaymentCalendarItems(
  transactions: DashboardTransaction[]
): PaymentCalendarItem[] {
  return transactions.map((tx) => {
    const [year, month, day] = tx.date.split("-").map(Number);
    return {
      id: tx.id,
      paymentId: tx.paymentId,
      merchant: tx.merchant,
      amount: tx.amount,
      category: tx.category,
      year,
      month,
      date: day,
      dateLabel: tx.dateLabel,
    };
  });
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

export function buildBudgetStats(
  payments: PaymentRecord[],
  totalBudget: number,
  currentBalance: number
) {
  const used = payments.reduce((sum, payment) => sum + payment.amount, 0);
  return {
    total: totalBudget,
    used,
    remaining: currentBalance,
    usagePercent: totalBudget > 0 ? Math.round((used / totalBudget) * 100) : 0,
    usageSpeedPercent: 12,
    doughnutCenterPercent: totalBudget > 0 ? Math.round((used / totalBudget) * 100) : 0,
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
