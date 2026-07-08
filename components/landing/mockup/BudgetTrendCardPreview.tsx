import Card from "@/components/common/Card";
import { MONTHLY_BUDGET_TREND } from "@/lib/dashboard-mock-data";

/**
 * 랜딩 페이지 목업 전용 정적 카드. 실제 대시보드의 BudgetTrendCard(Supabase 연동)와는
 * 별개로, lib/dashboard-mock-data.ts의 정적 데모 데이터를 간단한 막대그래프로만 보여준다.
 */
export default function BudgetTrendCardPreview() {
  const points = MONTHLY_BUDGET_TREND;
  const max = Math.max(...points.map((p) => p.used), 1);

  return (
    <Card className="flex min-w-0 flex-col !min-h-0 !p-3 !shadow-none hover:scale-100 hover:shadow-card">
      <h3 className="dash-card-title mb-2 shrink-0 text-sm">월별 예산 추이</h3>
      <div className="flex min-h-0 flex-1 items-end gap-1.5 px-0.5">
        {points.map((p) => (
          <div key={p.month} className="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-brand/70"
              style={{ height: `${Math.max(8, (p.used / max) * 48)}px` }}
            />
            <span className="text-[9px] text-muted">{p.month}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
