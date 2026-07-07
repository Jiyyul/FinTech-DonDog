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
