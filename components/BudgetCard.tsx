"use client";

import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CHART_COLORS, CHART_UI } from "@/lib/chart-colors";

ChartJS.register(ArcElement, Tooltip);

const data = {
  labels: ["행사비", "식비", "운영비", "기타"],
  datasets: [
    {
      data: [40, 30, 20, 10],
      backgroundColor: [
        CHART_COLORS.행사비,
        CHART_COLORS.식비,
        CHART_COLORS.운영비,
        CHART_COLORS.기타,
      ],
      borderColor: CHART_UI.card,
      borderWidth: 3,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "74%",
  plugins: { legend: { display: false }, tooltip: { enabled: true } },
};

export default function BudgetCard() {
  return (
    <div className="rounded-card border border-hairline bg-card p-5.5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-navy">이번 학기 예산</h3>

      <div className="mb-4 flex items-center gap-5">
        <div className="relative h-[118px] w-[118px] flex-shrink-0">
          <Doughnut data={data} options={options} />
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-navy">61%</span>
            <small className="text-[10px] text-muted">사용</small>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <Figure label="총 예산" value="₩3,000,000" />
          <Figure label="사용 금액" value="₩1,780,000" />
          <Figure label="잔액" value="₩1,220,000" />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2.5 border-t border-hairline pt-3.5">
        <Legend color={CHART_COLORS.행사비} label="행사비 40%" />
        <Legend color={CHART_COLORS.식비} label="식비 30%" />
        <Legend color={CHART_COLORS.운영비} label="운영비 20%" />
        <Legend color={CHART_COLORS.기타} label="기타 10%" />
      </div>
    </div>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-[11px] text-muted">{label}</label>
      <strong className="text-[15px] font-bold text-navy">{value}</strong>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-ink2">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ background: color }}
      />
      {label}
    </span>
  );
}
