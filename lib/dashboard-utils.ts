import type { MonthlyBudgetPoint } from "@/lib/dashboard-types";

export function enrichTrendWithMoM(
  data: MonthlyBudgetPoint[]
): MonthlyBudgetPoint[] {
  return data.map((point, index) => {
    if (index === 0) {
      return { ...point, changeRate: null };
    }
    const prev = data[index - 1].used;
    const changeRate = prev === 0 ? 0 : ((point.used - prev) / prev) * 100;
    return { ...point, changeRate: Math.round(changeRate * 10) / 10 };
  });
}

export function formatChangeRate(rate: number | null | undefined): string {
  if (rate === null || rate === undefined) return "-";
  const sign = rate > 0 ? "+" : "";
  return `${sign}${rate}%`;
}
