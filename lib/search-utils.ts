import type { DashboardTransaction } from "@/lib/dashboard-types";

export function matchesSearch(
  transaction: DashboardTransaction,
  query: string
): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const numericQuery = normalized.replace(/[^\d]/g, "");

  return (
    transaction.merchant.toLowerCase().includes(normalized) ||
    transaction.category.toLowerCase().includes(normalized) ||
    transaction.dateLabel.includes(normalized) ||
    (numericQuery.length > 0 && transaction.amount.toString().includes(numericQuery))
  );
}
