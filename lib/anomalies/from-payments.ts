import { detectAnomalies } from "@/lib/anomalies/detect-anomalies";
import type { AnomalyResult, AnomalySeverity, AnomalyType as RuleType } from "@/lib/anomalies/anomaly-types";
import type { GroupSettings, Schedule } from "@/lib/group/group-types";
import type { Transaction } from "@/lib/transactions/transaction-types";
import type {
  AnomalyType as AuditAnomalyType,
  AuditAnomaly,
  CalendarEvent,
  DashboardTransaction,
} from "@/lib/dashboard-types";

/**
 * 실제 결제내역(DashboardTransaction, SQLite+OpenAI 분류 결과)에
 * back_receipt의 규칙기반 이상거래 감지 엔진(detect-anomalies.ts)을 적용하기 위한 어댑터.
 * 두 프로젝트가 서로 다른 거래 데이터 모델을 쓰기 때문에 형 변환이 필요하다.
 */

const GROUP_ID = "group_001";

const SEVERITY_CONFIDENCE: Record<AnomalySeverity, number> = {
  high: 95,
  medium: 82,
  low: 65,
};

const RULE_TYPE_MAP: Record<RuleType, AuditAnomalyType> = {
  BUDGET_EXCEEDED: "rule_violation",
  HIGH_AMOUNT: "amount_threshold",
  DUPLICATE_PAYMENT: "duplicate_payment",
  SCHEDULE_MISMATCH: "schedule_mismatch",
  RECEIPT_REQUIRED: "receipt_required",
};

function buildGroupSettings(budgetTotal: number, amountThreshold: number): GroupSettings {
  return {
    id: GROUP_ID,
    name: "AI 핀테크 동아리",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    year: 2026,
    semester: "실결제 데이터",
    accountNumberMasked: "110-***-123456",
    initialAmount: budgetTotal,
    anomalyThresholdAmount: amountThreshold,
    ruleText: `${amountThreshold.toLocaleString()}원 이상 지출은 공동 승인 및 영수증 첨부가 필요합니다.`,
    ruleFileName: null,
  };
}

export function buildSchedules(events: CalendarEvent[]): Schedule[] {
  return events.map((event) => ({
    id: event.id,
    groupId: GROUP_ID,
    title: event.title,
    scheduleDate: `${event.year}-${String(event.month).padStart(2, "0")}-${String(event.date).padStart(2, "0")}`,
    expectedBudget: Number.MAX_SAFE_INTEGER,
    expectedCategory: "기타",
    description: event.description,
  }));
}

export function toRuleEngineTransactions(transactions: DashboardTransaction[]): Transaction[] {
  return transactions.map((tx) => ({
    id: tx.id,
    groupId: GROUP_ID,
    scheduleId: null,
    transactionDate: tx.date,
    merchant: tx.merchant,
    amount: tx.amount,
    transactionType: "expense",
    category: tx.category,
    hasReceipt: tx.hasReceipt ?? false,
    receiptId: null,
  }));
}

export function detectPaymentAnomalies(
  transactions: DashboardTransaction[],
  budgetTotal: number,
  amountThreshold: number,
  calendarEvents: CalendarEvent[]
): AnomalyResult[] {
  return detectAnomalies({
    transactions: toRuleEngineTransactions(transactions),
    schedules: buildSchedules(calendarEvents),
    groupSettings: buildGroupSettings(budgetTotal, amountThreshold),
  });
}

export function toAuditAnomalyQueue(
  results: AnomalyResult[],
  transactions: DashboardTransaction[]
): AuditAnomaly[] {
  const byId = new Map(transactions.map((tx) => [tx.id, tx]));

  const queue: AuditAnomaly[] = [];
  results.forEach((result, index) => {
    const transaction = byId.get(result.transactionId);
    if (!transaction) return;

    queue.push({
      id: `rule-${result.transactionId}-${result.type}-${index}`,
      type: RULE_TYPE_MAP[result.type],
      transaction,
      reason: result.description,
      confidence: SEVERITY_CONFIDENCE[result.severity],
      ruleReference: result.title,
    });
  });

  return queue;
}
