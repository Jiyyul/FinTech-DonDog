import type { BadgeVariant } from "@/lib/design-tokens";

export type AnomalyType =
  | "BUDGET_EXCEEDED"
  | "HIGH_AMOUNT"
  | "DUPLICATE_PAYMENT"
  | "SCHEDULE_MISMATCH"
  | "RECEIPT_REQUIRED";

export type AnomalySeverity = "low" | "medium" | "high";

export type AnomalyResult = {
  transactionId: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  title: string;
  description: string;
  reasons: string[];
};

/** 이상거래가 없는 거래에 붙는 가상의 상태값 */
export type TransactionStatus = AnomalyType | "NORMAL";

export const ANOMALY_TYPE_LABELS: Record<AnomalyType, string> = {
  BUDGET_EXCEEDED: "예산 초과",
  HIGH_AMOUNT: "고액 지출",
  DUPLICATE_PAYMENT: "중복 의심",
  SCHEDULE_MISMATCH: "일정 불일치",
  RECEIPT_REQUIRED: "영수증 필요",
};

export const STATUS_BADGE_CONFIG: Record<
  TransactionStatus,
  { label: string; variant: BadgeVariant }
> = {
  NORMAL: { label: "정상", variant: "success" },
  DUPLICATE_PAYMENT: { label: "중복 의심", variant: "danger" },
  HIGH_AMOUNT: { label: "고액 지출", variant: "warning" },
  SCHEDULE_MISMATCH: { label: "일정 불일치", variant: "warning" },
  BUDGET_EXCEEDED: { label: "예산 초과", variant: "danger" },
  RECEIPT_REQUIRED: { label: "영수증 필요", variant: "info" },
};

/** 한 거래에 여러 이상유형이 겹칠 때 배지로 보여줄 대표 유형 우선순위 */
const STATUS_PRIORITY: AnomalyType[] = [
  "DUPLICATE_PAYMENT",
  "HIGH_AMOUNT",
  "SCHEDULE_MISMATCH",
  "BUDGET_EXCEEDED",
  "RECEIPT_REQUIRED",
];

export type TransactionAnomalyGroup = {
  transactionId: string;
  results: AnomalyResult[];
  primaryType: TransactionStatus;
};

export function groupAnomaliesByTransaction(
  results: AnomalyResult[]
): Map<string, TransactionAnomalyGroup> {
  const map = new Map<string, TransactionAnomalyGroup>();

  for (const result of results) {
    const existing = map.get(result.transactionId);
    if (existing) {
      existing.results.push(result);
    } else {
      map.set(result.transactionId, {
        transactionId: result.transactionId,
        results: [result],
        primaryType: result.type,
      });
    }
  }

  for (const group of map.values()) {
    group.primaryType =
      STATUS_PRIORITY.find((type) => group.results.some((r) => r.type === type)) ??
      group.results[0]?.type ??
      "NORMAL";
  }

  return map;
}

export type AnomalySummary = {
  totalTransactions: number;
  anomalyCount: number;
  highAmountCount: number;
  duplicateCount: number;
  scheduleMismatchCount: number;
  receiptRequiredCount: number;
};

export function computeAnomalySummary(
  totalTransactions: number,
  results: AnomalyResult[]
): AnomalySummary {
  const byTransaction = groupAnomaliesByTransaction(results);

  const countDistinctTx = (type: AnomalyType) =>
    new Set(results.filter((r) => r.type === type).map((r) => r.transactionId)).size;

  return {
    totalTransactions,
    anomalyCount: byTransaction.size,
    highAmountCount: countDistinctTx("HIGH_AMOUNT"),
    duplicateCount: countDistinctTx("DUPLICATE_PAYMENT"),
    scheduleMismatchCount: countDistinctTx("SCHEDULE_MISMATCH"),
    receiptRequiredCount: countDistinctTx("RECEIPT_REQUIRED"),
  };
}
