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
  /** 테스트용: AI 분류 결과를 시드 시 직접 넣을 때 사용 */
  category?: BudgetCategory;
  confidence?: number;
};

export type PaymentClassificationRow = {
  paymentId: number;
  merchant: string;
  category: BudgetCategory;
  confidence: number;
  source: string;
};
