import Card from "@/components/common/Card";
import ProgressBar from "@/components/common/ProgressBar";
import AIMessage from "@/components/common/AIMessage";
import {
  BUDGET_SLICES,
  BUDGET_TOTAL,
  BUDGET_USED,
  BUDGET_REMAINING,
  BUDGET_USAGE_PERCENT,
} from "@/lib/dashboard-mock-data";
import { formatCurrency } from "@/lib/format";

/**
 * 랜딩 페이지 목업 전용 정적 카드. 실제 대시보드의 HeroBudgetCard(Supabase 연동)는
 * DashboardDataProvider가 없는 랜딩 페이지에서 렌더링할 수 없어서, 별도로 정적
 * 데모 데이터(lib/dashboard-mock-data.ts)만 사용하는 카드를 둔다.
 */
export default function HeroBudgetCardPreview() {
  return (
    <Card className="flex h-full min-h-0 min-w-0 flex-col !p-4 hover:scale-100 hover:shadow-card">
      <div className="mb-3 shrink-0">
        <p className="dash-section-label normal-case tracking-normal">2026년 1학기</p>
        <h2 className="mt-1 text-base font-bold tracking-title-tight text-navy">이번 학기 예산</h2>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div>
          <p className="text-lg font-bold leading-none tracking-title-tight text-navy tabular-nums">
            {formatCurrency(BUDGET_TOTAL)}
          </p>
          <p className="dash-section-label mt-1 text-[10px]">총 예산</p>

          <div className="mt-2.5 flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2">
              <p className="dash-section-label shrink-0 text-[10px]">사용</p>
              <p className="text-[11px] font-semibold tracking-title-tight text-navy tabular-nums">
                {formatCurrency(BUDGET_USED)}
              </p>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="dash-section-label shrink-0 text-[10px]">잔액</p>
              <p className="text-[11px] font-semibold tracking-title-tight text-navy tabular-nums">
                {formatCurrency(BUDGET_REMAINING)}
              </p>
            </div>
          </div>

          <div className="mt-2.5">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="dash-section-label text-[10px] normal-case tracking-normal">
                사용률
              </span>
              <span className="text-xs font-semibold tabular-nums text-navy">
                {BUDGET_USAGE_PERCENT}%
              </span>
            </div>
            <ProgressBar value={BUDGET_USAGE_PERCENT} className="h-2" />
          </div>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {BUDGET_SLICES.slice(0, 3).map((slice) => (
            <span
              key={slice.category}
              className="flex items-center gap-1.5 text-[9px] font-medium leading-none text-ink2"
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              {slice.category} {slice.percent}%
            </span>
          ))}
        </div>

        <AIMessage className="border-t border-hairline pt-2.5 [&_.dash-body]:text-[11px]">
          이번 달 행사비 비중이 높습니다.
        </AIMessage>
      </div>
    </Card>
  );
}
