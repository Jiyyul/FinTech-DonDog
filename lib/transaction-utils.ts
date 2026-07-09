import type { BudgetCategory, DashboardTransaction } from "@/lib/dashboard-types";

export type ManualTransactionInput = {
  merchant: string;
  amount: number;
  date: string;
  category: BudgetCategory;
  paymentMethod: string;
  hasReceipt: boolean;
};

export function formatTransactionDateLabel(date: string): string {
  const [, month, day] = date.split("-");
  return `${Number(month)}월 ${Number(day)}일`;
}

export function buildManualTransaction(
  input: ManualTransactionInput
): DashboardTransaction {
  const dateCompact = input.date.replace(/-/g, "");
  const suffix = String(Date.now()).slice(-3);

  return {
    id: `tx-manual-${Date.now()}`,
    merchant: input.merchant,
    category: input.category,
    date: input.date,
    dateLabel: formatTransactionDateLabel(input.date),
    amount: input.amount,
    status: "completed",
    paymentMethod: input.paymentMethod,
    transactionId: `TX-${dateCompact}-${suffix}`,
    hasReceipt: input.hasReceipt,
    aiConfidence: 100,
  };
}
