"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Card from "@/components/common/Card";
import AIMessage from "@/components/common/AIMessage";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { formatChangeRate } from "@/lib/dashboard-utils";
import { formatCurrency } from "@/lib/format";

const SCHEDULE_BUDGETS = [
  { name: "MT", budget: 850_000 },
  { name: "회식", budget: 320_000 },
  { name: "신입생 환영회", budget: 620_000 },
];

const AI_RECOMMENDATIONS = [
  "행사비 한도를 10% 줄이는 것을 추천합니다.",
  "공동 승인이 필요한 거래가 2건 있습니다.",
  "식비 예산은 다음 달 여유가 있습니다.",
];

function SectionDivider() {
  return <div className="my-8 border-t border-hairline" />;
}

function rateTone(rate: number) {
  if (rate < 0) return "text-success";
  if (rate > 0) return "text-warning";
  return "text-navy";
}

export default function FullReportPage() {
  const { aiReportSummary: report } = useDashboardData();

  const categoryChanges = [
    { label: "행사비", rate: report.eventMoM },
    { label: "식비", rate: report.foodMoM },
    { label: "운영비", rate: report.opsMoM },
    { label: "교통비", rate: -1.8 },
  ];

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-ink2 transition-colors duration-200 hover:text-navy"
      >
        <ArrowLeft size={18} strokeWidth={1.75} />
        뒤로가기
      </Link>

      <div className="mb-8">
        <p className="dash-section-label normal-case tracking-normal">2026년 1학기</p>
        <h1 className="ui-page-title mt-1">7월 리포트</h1>
      </div>

      <Card className="mb-0">
        <h2 className="mb-5 text-[16px] font-semibold text-navy">📈 요약</h2>
        <dl className="grid grid-cols-2 gap-4">
          <SummaryItem label="이번 달 총 지출" value={formatCurrency(5_320_000)} />
          <SummaryItem label="전월 대비" value={formatChangeRate(8.1)} valueClass="text-warning" />
          <SummaryItem label="예산 사용률" value="74%" />
          <SummaryItem label="AI 신뢰도" value={`${report.confidence}%`} valueClass="text-accent" />
        </dl>
      </Card>

      <SectionDivider />

      <Card>
        <h2 className="mb-5 text-[16px] font-semibold text-navy">💰 카테고리 분석</h2>
        <ul className="space-y-3">
          {categoryChanges.map((item) => (
            <li key={item.label} className="flex items-center justify-between text-[15px]">
              <span className="font-medium text-ink">{item.label}</span>
              <span className={`font-semibold tabular-nums ${rateTone(item.rate)}`}>
                {formatChangeRate(item.rate)}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <SectionDivider />

      <Card>
        <h2 className="mb-5 text-[16px] font-semibold text-navy">⚠ AI 이상 감지</h2>
        <ul className="space-y-3">
          <AnomalyRow label="회칙 위반 가능" count={report.ruleViolations} tone="danger" />
          <AnomalyRow label="공동 승인 필요" count={report.ruleViolations} tone="warning" />
          <AnomalyRow label="이상 거래" count={report.anomalyCount} tone="navy" />
        </ul>
      </Card>

      <SectionDivider />

      <Card>
        <h2 className="mb-5 text-[16px] font-semibold text-navy">📅 일정 분석</h2>
        <ul className="space-y-3">
          {SCHEDULE_BUDGETS.map((item) => (
            <li key={item.name} className="flex items-center justify-between text-[15px]">
              <span className="font-medium text-ink">{item.name}</span>
              <div className="text-right">
                <p className="text-[12px] text-muted">예산</p>
                <p className="font-semibold tabular-nums text-navy">
                  {formatCurrency(item.budget)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <SectionDivider />

      <Card>
        <h2 className="mb-5 text-[16px] font-semibold text-navy">🤖 Don Dog AI 분석</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-ink2">
          {report.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <AIMessage className="mt-5 border-t border-hairline pt-4">
          행사비 증가는 등록된 일정 예산 범위 내입니다.
        </AIMessage>
      </Card>

      <SectionDivider />

      <Card>
        <h2 className="mb-5 text-[16px] font-semibold text-navy">💡 AI 추천</h2>
        <ul className="space-y-3">
          {AI_RECOMMENDATIONS.map((item) => (
            <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-ink2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  valueClass = "text-navy",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl bg-appbg p-4 ring-1 ring-hairline">
      <dt className="text-[12px] text-muted">{label}</dt>
      <dd className={`mt-1.5 text-[clamp(1.1rem,1.8vw,1.35rem)] font-bold tabular-nums tracking-title-tight ${valueClass}`}>
        {value}
      </dd>
    </div>
  );
}

function AnomalyRow({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: "danger" | "warning" | "navy";
}) {
  const toneClass = {
    danger: "text-danger",
    warning: "text-warning",
    navy: "text-navy",
  }[tone];

  return (
    <li className="flex items-center justify-between text-[15px]">
      <span className="font-medium text-ink">{label}</span>
      <span className={`font-bold tabular-nums ${toneClass}`}>{count}건</span>
    </li>
  );
}


