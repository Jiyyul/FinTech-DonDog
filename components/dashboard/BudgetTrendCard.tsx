import Card from "@/components/common/Card";
import AIMessage from "@/components/common/AIMessage";
import BudgetTrendChart from "@/components/charts/BudgetTrendChart";
import { MONTHLY_BUDGET_TREND } from "@/lib/dashboard-mock-data";

export default function BudgetTrendCard({ className = "" }: { className?: string }) {
  return (
    <Card className={`flex min-h-[480px] min-w-0 flex-col ${className}`}>
      <h3 className="dash-card-title mb-6 shrink-0">월별 예산 추이</h3>

      <div className="min-h-0 flex-1 overflow-visible px-0.5">
        <BudgetTrendChart data={MONTHLY_BUDGET_TREND} />
      </div>

      <AIMessage className="mt-6 shrink-0 border-t border-hairline pt-5">
        3월 이후 행사비가 크게 증가했습니다.
      </AIMessage>
    </Card>
  );
}
