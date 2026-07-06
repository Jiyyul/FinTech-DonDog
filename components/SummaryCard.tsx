"use client";

import { Sparkles } from "lucide-react";

const POINTS = [
  "이번 달 식비 지출이 평소보다 18% 증가했습니다.",
  "회칙 위반 가능 거래 1건이 발견되었습니다.",
  "예산 사용률은 현재 61%입니다.",
  "최근 거래는 모두 자동 분류되었습니다.",
];

export default function SummaryCard() {
  return (
    <div className="rounded-card border border-hairline bg-card p-5.5 shadow-card">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-accent">
        <Sparkles size={18} />
        <span>이번 달 AI 요약</span>
      </div>
      <ul className="flex list-disc flex-col gap-2.5 pl-4.5">
        {POINTS.map((p) => (
          <li key={p} className="text-[12.5px] leading-relaxed text-ink2">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
