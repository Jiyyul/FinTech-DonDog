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
};

export default function BudgetDoughnutChart({
  slices,
  centerPercent,
  centerLabel = "사용 완료",
}: BudgetDoughnutChartProps) {
  const data = {
    labels: slices.map((s) => s.category),
    datasets: [
      {
        data: slices.map((s) => s.percent),
        backgroundColor: slices.map((s) => s.color),
        borderColor: CHART_UI.card,
        borderWidth: 3,
        borderRadius: 12,
        spacing: 4,
        hoverOffset: 4,
        hoverBorderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "78%",
    animation: {
      animateRotate: true,
      duration: 700,
      easing: "easeOutQuart",
    },
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
    <div className="relative mx-auto h-[212px] w-[212px] overflow-visible transition-transform duration-card ease-premium hover:scale-[1.01]">
      <div
        className="pointer-events-none absolute inset-[10px] z-0 rounded-full"
        style={{ backgroundColor: CHART_UI.track }}
        aria-hidden
      />
      <div className="relative z-[2] h-full w-full">
        <Doughnut data={data} options={options} />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center">
        <span className="text-[34px] font-bold leading-none tracking-title-tight text-navy tabular-nums">
          {centerPercent}%
        </span>
        <span className="mt-1.5 text-[13px] font-medium text-muted">
          {centerLabel}
        </span>
      </div>
    </div>
  );
}
