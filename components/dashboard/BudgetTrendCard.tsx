import Card from "@/components/common/Card";
import AIMessage from "@/components/common/AIMessage";
import BudgetTrendChart from "@/components/charts/BudgetTrendChart";
import { MONTHLY_BUDGET_TREND } from "@/lib/dashboard-mock-data";
import { formatChangeRate } from "@/lib/dashboard-utils";

export default function BudgetTrendCard({ className = "" }: { className?: string }) {
  const latest = MONTHLY_BUDGET_TREND[MONTHLY_BUDGET_TREND.length - 1];

  return (
    <Card className={`flex min-h-[480px] min-w-0 flex-col ${className}`}>
      <h3 className="dash-card-title mb-6 shrink-0">월별 예산 추이</h3>

      <div className="min-h-0 flex-1 overflow-visible px-0.5">
        <BudgetTrendChart data={MONTHLY_BUDGET_TREND} />
      </div>

      <AIMessage className="mt-6 shrink-0 border-t border-hairline pt-5">
        6월 사용액 전월 대비 {formatChangeRate(latest.changeRate)} 변동했습니다.
      </AIMessage>
    </Card>
  );
}
