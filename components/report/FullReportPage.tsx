"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Card from "@/components/common/Card";
import AIMessage from "@/components/common/AIMessage";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { formatChangeRate } from "@/lib/dashboard-utils";
import { formatCurrency } from "@/lib/format";
import type { CalendarEvent } from "@/lib/dashboard-types";

function SectionDivider() {
  return <div className="my-8 border-t border-hairline" />;
}

function rateTone(rate: number | null) {
  if (rate == null || rate === 0) return "text-navy";
  if (rate < 0) return "text-success";
  return "text-warning";
}

function eventDateStr(event: CalendarEvent): string {
  return `${event.year}-${String(event.month).padStart(2, "0")}-${String(event.date).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  return Math.abs(Math.round((new Date(a).getTime() - new Date(b).getTime()) / 86_400_000));
}

export default function FullReportPage() {
  const { aiReportSummary: report, budgetUsed, budgetUsagePercent, calendarEvents, allTransactions, budgetSlices } =
    useDashboardData();

  const categoryChanges = [
    { label: "행사비", rate: report.eventMoM },
    { label: "식비", rate: report.foodMoM },
    { label: "운영비", rate: report.opsMoM },
    { label: "교통비", rate: report.trafficMoM },
  ];

  const scheduleSpend = calendarEvents.map((event) => {
    const eventDate = eventDateStr(event);
    const spend = allTransactions
      .filter((t) => daysBetween(t.date, eventDate) <= 3)
      .reduce((sum, t) => sum + t.amount, 0);
    return { name: event.title, spend };
  });

  const topSlice = budgetSlices[0];

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
          <SummaryItem label="이번 달 총 지출" value={formatCurrency(budgetUsed)} />
          <SummaryItem
            label="전월 대비"
            value={formatChangeRate(report.totalMoM)}
            valueClass={rateTone(report.totalMoM)}
          />
          <SummaryItem label="예산 사용률" value={`${budgetUsagePercent}%`} />
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
          <AnomalyRow label="공동 승인 필요" count={report.coApprovalRequired} tone="warning" />
          <AnomalyRow label="이상 거래" count={report.anomalyCount} tone="navy" />
        </ul>
      </Card>

      <SectionDivider />

      <Card>
        <h2 className="mb-5 text-[16px] font-semibold text-navy">📅 일정 분석</h2>
        {scheduleSpend.length === 0 ? (
          <p className="text-[14px] text-muted">등록된 일정이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {scheduleSpend.map((item) => (
              <li key={item.name} className="flex items-center justify-between text-[15px]">
                <span className="font-medium text-ink">{item.name}</span>
                <div className="text-right">
                  <p className="text-[12px] text-muted">전후 3일 관련 지출</p>
                  <p className="font-semibold tabular-nums text-navy">
                    {formatCurrency(item.spend)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <SectionDivider />

      <Card>
        <h2 className="mb-5 text-[16px] font-semibold text-navy">🤖 Don Dog AI 분석</h2>
        <div className="space-y-4 text-[15px] leading-relaxed text-ink2">
          {report.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {topSlice && (
          <AIMessage className="mt-5 border-t border-hairline pt-4">
            이번 달 지출 비중이 가장 높은 항목은 {topSlice.category}({topSlice.percent}%)입니다.
          </AIMessage>
        )}
      </Card>

      <SectionDivider />

      <Card>
        <h2 className="mb-5 text-[16px] font-semibold text-navy">💡 AI 추천</h2>
        <ul className="space-y-3">
          {report.recommendations.map((item) => (
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


