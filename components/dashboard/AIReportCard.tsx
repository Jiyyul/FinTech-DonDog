"use client";

import Link from "next/link";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { ArrowRight } from "lucide-react";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { formatChangeRate } from "@/lib/dashboard-utils";

type AIReportCardProps = {
  className?: string;
  emptyData?: boolean;
};

type MetricTone = "navy" | "success" | "warning" | "danger";

const toneClasses: Record<MetricTone, string> = {
  navy: "text-navy",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

function ReportMetric({
  value,
  description,
  tone = "navy",
}: {
  value: string;
  description: string;
  tone?: MetricTone;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-appbg px-4 py-3 ring-1 ring-hairline">
      <p
        className={`text-[clamp(1.35rem,2vw,1.65rem)] font-bold leading-none tracking-title-tight tabular-nums ${toneClasses[tone]}`}
      >
        {value}
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-ink2">{description}</p>
    </div>
  );
}

function momTone(rate: number | null): MetricTone {
  if (rate == null) return "navy";
  if (rate < 0) return "success";
  if (rate >= 5) return "warning";
  return "navy";
}

export default function AIReportCard({
  className = "",
  emptyData = false,
}: AIReportCardProps) {
  const { aiReportSummary: report } = useDashboardData();

  if (emptyData) {
    return (
      <Card className={`flex min-w-0 flex-col ${className}`}>
        <div className="mb-5 flex shrink-0 flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-subtle text-sm ring-1 ring-accent/20"
              aria-hidden
            >
              🐶
            </span>
            <h3 className="dash-card-title">AI 회계 리포트</h3>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-8 text-center">
          <p className="text-[15px] font-medium text-ink">아직 분석할 데이터가 없습니다</p>
          <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-muted">
            거래와 예산이 등록되면 AI가 자동으로 회계 리포트를 생성합니다.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`flex min-w-0 flex-col ${className}`}>
      <div className="mb-5 flex shrink-0 flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-subtle text-sm ring-1 ring-accent/20"
            aria-hidden
          >
            🐶
          </span>
          <h3 className="dash-card-title">AI 회계 리포트</h3>
        </div>
        <Badge variant="accent">신뢰도 {report.confidence}%</Badge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <ReportMetric
          value={formatChangeRate(report.foodMoM)}
          description="전달 대비 식비 변화"
          tone={momTone(report.foodMoM)}
        />
        <ReportMetric
          value={formatChangeRate(report.eventMoM)}
          description="전달 대비 행사비 변화"
          tone={momTone(report.eventMoM)}
        />
        <ReportMetric
          value={formatChangeRate(report.opsMoM)}
          description="전달 대비 운영비 변화"
          tone={momTone(report.opsMoM)}
        />
        <ReportMetric
          value={report.overBudgetItems.join(", ") || "-"}
          description="예산 초과 항목"
          tone="warning"
        />
        <ReportMetric
          value={`${report.anomalyCount}건`}
          description="이상 거래 감지"
          tone="warning"
        />
      </div>

      <div className="mt-5 shrink-0">
        <Link href="/report">
          <Button
            variant="secondary"
            className="w-full"
            icon={<ArrowRight size={15} strokeWidth={1.5} />}
          >
            전체 리포트 보기
          </Button>
        </Link>
      </div>
    </Card>
  );
}
