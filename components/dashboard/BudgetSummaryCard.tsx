import Card from "@/components/common/Card";
import ProgressBar from "@/components/common/ProgressBar";
import AIMessage from "@/components/common/AIMessage";
import {
  BUDGET_TOTAL,
  BUDGET_USED,
  BUDGET_REMAINING,
  BUDGET_USAGE_PERCENT,
  BUDGET_USAGE_SPEED_PERCENT,
} from "@/lib/dashboard-mock-data";
import { formatCurrency } from "@/lib/format";

export default function BudgetSummaryCard() {
  return (
    <Card className="flex min-h-[420px] min-w-0 flex-col">
      <h3 className="dash-card-title mb-5 shrink-0">예산 요약</h3>

      <div className="flex min-h-0 flex-1 flex-col">
        <div>
          <p className="dash-metric-xl">{formatCurrency(BUDGET_TOTAL)}</p>
          <p className="dash-section-label mt-2">총 예산</p>
        </div>

        <div className="my-5 h-px bg-hairline" />

        <div className="grid grid-cols-2 gap-4 min-[1280px]:gap-6">
          <div>
            <p className="dash-section-label">사용</p>
            <p className="dash-metric-lg mt-1.5">{formatCurrency(BUDGET_USED)}</p>
          </div>
          <div>
            <p className="dash-section-label">잔액</p>
            <p className="dash-metric-lg mt-1.5">
              {formatCurrency(BUDGET_REMAINING)}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="dash-section-label normal-case tracking-normal">
              사용률
            </span>
            <span className="dash-kpi-highlight">
              {BUDGET_USAGE_PERCENT}%
            </span>
          </div>
          <ProgressBar value={BUDGET_USAGE_PERCENT} />
          <p className="mt-3 text-[12px] leading-relaxed text-muted">
            이번 달 평균 대비{" "}
            <span className="dash-kpi-warning">
              {BUDGET_USAGE_SPEED_PERCENT}%
            </span>{" "}
            빠른 속도로 사용 중
          </p>
        </div>
      </div>

      <AIMessage className="mt-5 shrink-0 border-t border-hairline pt-4">
        이번 달 행사비 비중이 높습니다.
      </AIMessage>
    </Card>
  );
}
