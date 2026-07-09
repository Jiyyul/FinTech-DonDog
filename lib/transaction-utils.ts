import type { BudgetCategory } from "@/lib/dashboard-types";

export type ManualTransactionInput = {
  merchant: string;
  amount: number;
  date: string;
  category: BudgetCategory;
  paymentMethod: string;
  receiptFile: File;
};

export function formatTransactionDateLabel(date: string): string {
  const [, month, day] = date.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}
