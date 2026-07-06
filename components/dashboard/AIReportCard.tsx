import Link from "next/link";
import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import KPICard from "@/components/common/KPICard";
import { ArrowRight } from "lucide-react";

type AIReportCardProps = {
  className?: string;
};

export default function AIReportCard({ className = "" }: AIReportCardProps) {
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
        <Badge variant="accent">신뢰도 98%</Badge>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-3">
        <KPICard
          label="최고 비중"
          value="37%"
          description="이번 달 식비 비중이 가장 높습니다."
          tone="navy"
        />
        <KPICard
          label="예산 초과"
          value="+8%"
          description="행사비가 예산보다 초과되었습니다."
          tone="warning"
        />
        <KPICard
          label="위반 가능"
          value="1건"
          description="회칙 위반 가능 거래가 발견되었습니다."
          tone="danger"
        />
      </div>

      <div className="mt-6 shrink-0">
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
