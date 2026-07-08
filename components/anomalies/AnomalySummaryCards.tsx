import KPICard from "@/components/common/KPICard";
import type { AnomalySummary } from "@/lib/anomalies/anomaly-types";

type AnomalySummaryCardsProps = {
  summary: AnomalySummary;
};

export default function AnomalySummaryCards({ summary }: AnomalySummaryCardsProps) {
  return (
    <div className="dash-grid-summary">
      <KPICard
        label="전체 거래"
        value={`${summary.totalTransactions}건`}
        description="등록된 전체 거래 수"
        tone="navy"
      />
      <KPICard
        label="이상거래"
        value={`${summary.anomalyCount}건`}
        description="확인이 필요한 거래"
        tone="danger"
      />
      <KPICard
        label="고액 지출"
        value={`${summary.highAmountCount}건`}
        description="기준금액 초과 지출"
        tone="warning"
      />
      <KPICard
        label="중복 의심"
        value={`${summary.duplicateCount}건`}
        description="중복 결제 가능성"
        tone="danger"
      />
      <KPICard
        label="일정 불일치"
        value={`${summary.scheduleMismatchCount}건`}
        description="등록된 일정과 불일치"
        tone="warning"
      />
      <KPICard
        label="영수증 필요"
        value={`${summary.receiptRequiredCount}건`}
        description="영수증 미등록 거래"
        tone="accent"
      />
    </div>
  );
}
