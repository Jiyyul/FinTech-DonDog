"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { BudgetCategorySlice } from "@/lib/dashboard-types";
import { CHART_UI } from "@/lib/chart-colors";
import { CHART_TOOLTIP_BASE } from "@/lib/chart-external-tooltip";
import { formatCurrency } from "@/lib/format";

ChartJS.register(ArcElement, Tooltip);

type BudgetDoughnutChartProps = {
  slices: BudgetCategorySlice[];
  centerPercent: number;
  centerLabel?: string;
  size?: "default" | "large" | "compact";
  preview?: boolean;
};

const SIZE_CONFIG = {
  default: { box: 212, center: 34, inset: 10, label: 13 },
  large: { box: 244, center: 40, inset: 12, label: 14 },
  compact: { box: 136, center: 24, inset: 6, label: 10 },
} as const;

export default function BudgetDoughnutChart({
  slices,
  centerPercent,
  centerLabel = "사용 완료",
  size = "default",
  preview = false,
}: BudgetDoughnutChartProps) {
  const dim = SIZE_CONFIG[size];
  const data = {
    labels: slices.map((s) => s.category),
    datasets: [
      {
        data: slices.map((s) => s.percent),
        backgroundColor: slices.map((s) => s.color),
        borderColor: CHART_UI.card,
        borderWidth: preview ? 2 : 3,
        borderRadius: preview ? 0 : 12,
        spacing: preview ? 0 : 4,
        hoverOffset: preview ? 0 : 4,
        hoverBorderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "78%",
    animation: preview
      ? false
      : {
          animateRotate: true,
          duration: 700,
          easing: "easeOutQuart",
        },
    devicePixelRatio: preview ? 2 : undefined,
    plugins: {
      legend: { display: false },
      tooltip: {
        ...CHART_TOOLTIP_BASE,
        callbacks: {
          label: (ctx) => {
            const slice = slices[ctx.dataIndex];
            return ` ${slice.category}: ${formatCurrency(slice.amount)} (${slice.percent}%)`;
          },
        },
      },
    },
  };

  return (
    <div
      className={`relative mx-auto overflow-visible ${
        preview ? "" : "transition-transform duration-card ease-premium hover:scale-[1.01]"
      }`}
      style={{ height: dim.box, width: dim.box }}
    >
      <div
        className="pointer-events-none absolute z-0 rounded-full"
        style={{
          backgroundColor: CHART_UI.track,
          top: dim.inset,
          right: dim.inset,
          bottom: dim.inset,
          left: dim.inset,
        }}
        aria-hidden
      />
      <div className="relative z-[2] h-full w-full">
        <Doughnut data={data} options={options} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center">
        <span
          className="font-bold leading-none tracking-title-tight text-navy tabular-nums"
          style={{ fontSize: dim.center }}
        >
          {centerPercent}%
        </span>
        <span
          className="mt-1.5 font-medium text-muted"
          style={{ fontSize: dim.label }}
        >
          {centerLabel}
        </span>
      </div>
    </div>
  );
}
