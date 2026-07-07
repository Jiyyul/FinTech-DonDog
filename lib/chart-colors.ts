import type { BudgetCategory } from "@/lib/dashboard-types";

/** Design System v2 — Chart Palette */
export const CHART_COLORS: Record<BudgetCategory, string> = {
  행사비: "#5B8DEF",
  식비: "#8FD36B",
  운영비: "#93B2F8",
  교통비: "#FFD166",
  장비비: "#4FB3BF",
  홍보비: "#FF8C69",
  기타: "#CBD5E1",
};

/** @deprecated Use CHART_COLORS */
export const CATEGORY_COLORS = CHART_COLORS;

export const CHART_UI = {
  navy: "#0A1680",
  border: "#E8EDF2",
  grid: "#F3F5F7",
  tooltipBg: "#FFFFFF",
  muted: "#94A3B8",
  track: "#F3F5F7",
  card: "#FFFFFF",
} as const;

export function chartColorAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
