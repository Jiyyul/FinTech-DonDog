"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { MonthlyBudgetPoint } from "@/lib/dashboard-types";
import { CHART_COLORS, CHART_UI, chartColorAlpha } from "@/lib/chart-colors";
import { CHART_TOOLTIP_BASE } from "@/lib/chart-external-tooltip";
import { formatCurrency } from "@/lib/format";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

type BudgetTrendChartProps = {
  data: MonthlyBudgetPoint[];
  preview?: boolean;
};

export default function BudgetTrendChart({ data, preview = false }: BudgetTrendChartProps) {
  if (data.length === 0) {
    return null;
  }

  const lineColor = CHART_COLORS.행사비;

  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "사용",
        data: data.map((d) => d.used),
        borderColor: lineColor,
        backgroundColor: chartColorAlpha(lineColor, 0.08),
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointBackgroundColor: lineColor,
        pointBorderColor: CHART_UI.card,
        pointBorderWidth: 2,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: preview
      ? false
      : {
          duration: 700,
          easing: "easeOutQuart",
        },
    devicePixelRatio: preview ? 2 : undefined,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: CHART_UI.muted,
          font: { size: preview ? 10 : 12, weight: 500 },
          padding: preview ? 4 : 10,
        },
      },
      y: {
        grid: {
          color: CHART_UI.grid,
        },
        border: { display: false },
        ticks: {
          color: CHART_UI.muted,
          font: { size: preview ? 9 : 12 },
          padding: preview ? 4 : 8,
          maxTicksLimit: preview ? 4 : undefined,
          callback: (value) => `${Number(value) / 10000}만`,
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        ...CHART_TOOLTIP_BASE,
        displayColors: false,
        callbacks: {
          title: (items) => items[0]?.label ?? "",
          label: () => "",
          afterBody: (items) => {
            const point = data[items[0]?.dataIndex ?? 0];
            if (!point) return [];
            const lines = [`사용: ${formatCurrency(point.used)}`];
            if (point.changeRate !== null && point.changeRate !== undefined) {
              const sign = point.changeRate > 0 ? "+" : "";
              lines.push(`전월 대비: ${sign}${point.changeRate}%`);
            }
            lines.push(`예산: ${formatCurrency(point.budget)}`);
            return lines;
          },
        },
      },
    },
  };

  return (
    <div
      className={`relative h-full w-full min-w-0 overflow-visible ${
        preview ? "min-h-[110px]" : "min-h-[240px]"
      }`}
    >
      <Line data={chartData} options={options} />
    </div>
  );
}
