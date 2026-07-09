import type { BudgetCategory } from "@/lib/dashboard-types";

export type PaymentRecord = {
  id: number;
  merchant: string;
  amount: number;
  balance: number;
  transactedAt: string;
  paymentMethod: string;
};

export type PaymentSeedRow = {
  merchant: string;
  amount: number;
  transacted_at: string;
  payment_method?: string;
};

export type PaymentClassificationRow = {
  paymentId: number;
  merchant: string;
  category: BudgetCategory;
  confidence: number;
  source: string;
};

/** DashboardTransaction/Transaction id(`tx-001`)와 실제 payments.id(숫자) 사이의 변환. */
export function paymentIdToTransactionId(id: number): string {
  return `tx-${String(id).padStart(3, "0")}`;
}

export function transactionIdToPaymentId(transactionId: string): number | null {
  const match = /^tx-(\d+)$/.exec(transactionId);
  return match ? Number(match[1]) : null;
}
