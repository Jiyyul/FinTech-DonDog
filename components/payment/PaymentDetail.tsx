import type { Plan } from "@/lib/plans";
import { formatPlanPrice } from "@/lib/plans";

type PaymentDetailProps = {
  plan: Plan;
  firstPaymentLabel: string;
  nextPaymentLabel: string;
};

export default function PaymentDetail({
  plan,
  firstPaymentLabel,
  nextPaymentLabel,
}: PaymentDetailProps) {
  const rows = [
    { label: "상품명", value: plan.productName },
    { label: "금액", value: formatPlanPrice(plan), sub: plan.amount > 0 ? "부가세 포함" : undefined },
    { label: "조직 관리", value: plan.organizationLimit },
    { label: "첫 결제일", value: firstPaymentLabel },
    { label: "다음 결제일", value: nextPaymentLabel, sub: "매월 동일한 날짜" },
  ];

  return (
    <div className="rounded-2xl border border-hairline bg-card p-5 sm:p-6">
      <h4 className="text-[15px] font-semibold text-navy">결제 정보</h4>
      <dl className="mt-4 space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-[13px] text-muted">{row.label}</dt>
            <dd className="text-right">
              <p className="text-[14px] font-medium text-ink">{row.value}</p>
              {row.sub && <p className="mt-0.5 text-[12px] text-muted">{row.sub}</p>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
