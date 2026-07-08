import { Check, X } from "lucide-react";
import type { Plan } from "@/lib/plans";

type PlanFeatureListProps = {
  plan: Plan;
  compact?: boolean;
  featureLimit?: number;
};

export default function PlanFeatureList({
  plan,
  compact = false,
  featureLimit,
}: PlanFeatureListProps) {
  const features = featureLimit ? plan.features.slice(0, featureLimit) : plan.features;
  const textClass = compact ? "text-[12px]" : "text-[14px]";

  return (
    <div className="space-y-4">
      <div
        className={`flex items-center justify-between rounded-xl bg-surface/70 px-3.5 py-2.5 ring-1 ring-hairline ${
          compact ? "text-[12px]" : "text-[13px]"
        }`}
      >
        <span className="font-medium text-ink2">조직 관리</span>
        <span className="font-semibold text-navy">{plan.organizationLimit}</span>
      </div>

      <ul className={compact ? "space-y-2" : "space-y-3"}>
        {features.map((feature) => (
          <li key={feature} className={`flex items-start gap-2.5 ${textClass} text-ink2`}>
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" strokeWidth={2} />
            {feature}
          </li>
        ))}
      </ul>

      {plan.limitations && plan.limitations.length > 0 && (
        <ul
          className={`${compact ? "space-y-2" : "space-y-3"} border-t border-hairline pt-4`}
        >
          {plan.limitations.map((limitation) => (
            <li
              key={limitation}
              className={`flex items-start gap-2.5 ${textClass} text-muted`}
            >
              <X className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={2} />
              {limitation}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
