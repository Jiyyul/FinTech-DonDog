import Card from "@/components/common/Card";
import AIMessage from "@/components/common/AIMessage";
import BudgetTrendChart from "@/components/charts/BudgetTrendChart";
import {
  MONTHLY_BUDGET_TREND,
  EMPTY_MONTHLY_BUDGET_TREND,
} from "@/lib/dashboard-mock-data";
import { formatChangeRate } from "@/lib/dashboard-utils";

type BudgetTrendCardProps = {
  className?: string;
  preview?: boolean;
  emptyData?: boolean;
};

export default function BudgetTrendCard({
  className = "",
  preview = false,
  emptyData = false,
}: BudgetTrendCardProps) {
  const trendData = emptyData ? EMPTY_MONTHLY_BUDGET_TREND : MONTHLY_BUDGET_TREND;
  const latest = trendData[trendData.length - 1];

  return (
    <Card
      className={`flex min-w-0 flex-col ${
        preview
          ? "!min-h-0 !p-3 !shadow-none hover:scale-100 hover:shadow-card"
          : "min-h-[480px]"
      } ${className}`}
    >
      <h3
        className={`dash-card-title shrink-0 ${
          preview ? "mb-2 text-sm" : "mb-6"
        }`}
      >
        월별 예산 추이
      </h3>

      <div className={`min-h-0 flex-1 ${preview ? "px-0" : "overflow-visible px-0.5"}`}>
        <BudgetTrendChart preview={preview} data={trendData} />
      </div>

      {!preview && (
        <AIMessage className="mt-6 shrink-0 border-t border-hairline pt-5">
          {emptyData
            ? "거래 내역이 쌓이면 월별 추이를 확인할 수 있습니다."
            : `6월 사용액 전월 대비 ${formatChangeRate(latest.changeRate)} 변동했습니다.`}
        </AIMessage>
      )}
    </Card>
  );
}
