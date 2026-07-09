import type { BudgetCategory, DashboardTransaction, MonthlyBudgetPoint } from "@/lib/dashboard-types";
import { enrichTrendWithMoM } from "@/lib/dashboard-utils";

export const BUDGET_TREND_MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월"] as const;

export const BUDGET_TREND_CATEGORIES: BudgetCategory[] = [
  "행사비",
  "식비",
  "운영비",
  "교통비",
  "장비비",
  "기타",
];

export type BudgetTrendFilter = "전체" | BudgetCategory;

/** 월별 사용 금액 (만원 단위) */
export const MONTHLY_BY_CATEGORY: Record<string, number[]> = {
  전체: [620, 780, 1050, 890, 1120, 860],
  행사비: [280, 320, 450, 380, 520, 410],
  식비: [180, 210, 280, 240, 310, 250],
  운영비: [90, 120, 150, 130, 160, 110],
  교통비: [40, 55, 80, 60, 70, 50],
  장비비: [20, 45, 60, 50, 40, 30],
  기타: [10, 30, 40, 30, 20, 10],
};

const MERCHANTS: Record<BudgetCategory, string[]> = {
  행사비: ["MT 펜션 예약", "행사장 대관", "워크숍 시설", "OT 장소 예약", "송년 행사 준비"],
  식비: ["김밥천국", "한식당 모임", "치킨 모임", "간식 마트", "커피 모임"],
  운영비: ["프린트카페", "교보문고", "사무용품 마트", "인쇄소"],
  교통비: ["버스 대절", "KTX 단체 예매", "택시 호출", "주차 정산"],
  장비비: ["전자상가", "악기 대여", "장비 구매", "소모품 마트"],
  홍보비: ["광고 대행", "배너 제작"],
  기타: ["편의점 CU", "잡화점", "기타 경비"],
};

function splitIntoParts(total: number, count: number): number[] {
  const base = Math.floor(total / count);
  const remainder = total - base * count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

function buildMonthlyTransactions(): DashboardTransaction[] {
  const transactions: DashboardTransaction[] = [];
  let idCounter = 1;

  BUDGET_TREND_MONTHS.forEach((_, monthIndex) => {
    const month = monthIndex + 1;

    BUDGET_TREND_CATEGORIES.forEach((category) => {
      const totalMan = MONTHLY_BY_CATEGORY[category]?.[monthIndex] ?? 0;
      const total = totalMan * 10_000;
      if (total <= 0) return;

      const parts = splitIntoParts(total, 3);
      const merchants = MERCHANTS[category];

      parts.forEach((amount, partIndex) => {
        const day = Math.min(5 + partIndex * 9, 28);
        const paddedMonth = String(month).padStart(2, "0");
        const paddedDay = String(day).padStart(2, "0");

        transactions.push({
          id: `budget-tx-${idCounter}`,
          merchant: merchants[partIndex % merchants.length] ?? `${category} 지출`,
          category,
          date: `2026-${paddedMonth}-${paddedDay}`,
          dateLabel: `${month}월 ${day}일`,
          amount,
          status:
            partIndex === 0 && monthIndex % 3 === 0 ? "review" : "completed",
          paymentMethod: "학생회 체크카드",
          transactionId: `TX-2026${paddedMonth}-${String(idCounter).padStart(3, "0")}`,
          hasReceipt: partIndex % 2 === 0,
          aiConfidence: 90 + (partIndex % 8),
        });
        idCounter += 1;
      });
    });
  });

  return transactions;
}

export const BUDGET_MONTHLY_TRANSACTIONS = buildMonthlyTransactions();

export function getMonthlyTrendTransactions(
  monthIndex: number,
  filter: BudgetTrendFilter
): DashboardTransaction[] {
  const month = monthIndex + 1;
  const monthPrefix = `2026-${String(month).padStart(2, "0")}`;

  return BUDGET_MONTHLY_TRANSACTIONS.filter((tx) => {
    if (!tx.date.startsWith(monthPrefix)) return false;
    if (filter === "전체") return true;
    return tx.category === filter;
  }).sort((a, b) => b.date.localeCompare(a.date));
}

export function getMonthlyTrendTotal(monthIndex: number, filter: BudgetTrendFilter): number {
  const values = MONTHLY_BY_CATEGORY[filter] ?? MONTHLY_BY_CATEGORY.전체;
  return (values[monthIndex] ?? 0) * 10_000;
}

export function getCategoryTrendData(filter: BudgetTrendFilter): MonthlyBudgetPoint[] {
  const values = MONTHLY_BY_CATEGORY[filter] ?? MONTHLY_BY_CATEGORY.전체;
  const points: MonthlyBudgetPoint[] = BUDGET_TREND_MONTHS.map((month, index) => ({
    month,
    used: (values[index] ?? 0) * 10_000,
    budget: 0,
    balance: 0,
  }));
  return enrichTrendWithMoM(points);
}
