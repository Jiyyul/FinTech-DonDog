import PlanFeatureList from "@/components/plans/PlanFeatureList";
import type { Plan } from "@/lib/plans";
import { formatPlanPrice } from "@/lib/plans";

type PlanSummaryProps = {
  plan: Plan;
};

export default function PlanSummary({ plan }: PlanSummaryProps) {
  return (
    <div className="h-full rounded-2xl bg-surface/80 p-6 ring-1 ring-hairline sm:p-7">
      <p className="dash-section-label">선택한 플랜</p>
      <h3 className="mt-2 text-2xl font-bold tracking-title-tight text-navy">{plan.name}</h3>
      <p className="mt-3 text-[1.5rem] font-bold tracking-title-tight text-navy">
        {formatPlanPrice(plan)}
      </p>

      <div className="mt-8">
        <p className="text-[13px] font-semibold text-ink">포함 기능</p>
        <div className="mt-4">
          <PlanFeatureList plan={plan} />
        </div>
      </div>
    </div>
  );
}
