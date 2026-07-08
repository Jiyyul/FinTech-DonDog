export type TransactionType = "income" | "expense";

/**
 * 이상거래 감지·영수증 매칭 기능에서 사용하는 거래 타입.
 * lib/dashboard-mock-data.ts 의 DashboardTransaction(메인 대시보드 위젯용)과는
 * 별개의 데이터 모델이며, category 는 이미 거래에 들어있는 값만 사용한다.
 * (AI 분류 없음 — 값이 없으면 resolveCategory 가 "기타"로 처리)
 */
export type Transaction = {
  id: string;
  groupId: string;
  scheduleId?: string | null;
  transactionDate: string;
  transactionTime?: string | null;
  merchant: string;
  amount: number;
  transactionType: TransactionType;
  memo?: string | null;
  category?: string;
  isAnomaly?: boolean;
  anomalyReasons?: string[];
  hasReceipt?: boolean;
  receiptId?: string | null;
  createdAt?: string;
};

export function resolveCategory(category?: string | null): string {
  const trimmed = category?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "기타";
}
