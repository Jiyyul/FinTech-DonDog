"use client";

import Badge from "@/components/common/Badge";
import PlanFeatureList from "@/components/plans/PlanFeatureList";
import type { Plan } from "@/lib/plans";
import { formatPlanPrice } from "@/lib/plans";

type PlanPricingCardProps = {
  plan: Plan;
  onCtaClick: () => void;
};

export default function PlanPricingCard({ plan, onCtaClick }: PlanPricingCardProps) {
  const { featured } = plan;

  return (
    <div
      className={`relative flex h-full flex-col rounded-card border bg-card p-7 shadow-card transition-all duration-300 ease-premium hover:-translate-y-2 hover:shadow-card-hover ${
        featured
          ? "z-10 scale-[1.03] border-brand/40 shadow-[0_16px_48px_rgba(10,22,128,0.14)] ring-2 ring-brand/15 lg:scale-105"
          : "border-hairline"
      }`}
    >
      {featured && (
        <>
          <div className="pointer-events-none absolute -inset-px rounded-card bg-gradient-to-b from-brand/10 to-transparent opacity-60" />
          <Badge variant="accent" className="relative mb-4 w-fit">
            추천
          </Badge>
        </>
      )}

      <div className="relative flex min-h-0 flex-1 flex-col">
        <h3 className="text-xl font-bold tracking-title-tight text-navy">{plan.name}</h3>
        <p className="mt-2 text-sm text-ink2">{plan.description}</p>

        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-title-tight text-navy">
            {plan.priceLabel}
          </span>
          {plan.period && <span className="text-sm text-muted">/ {plan.period}</span>}
        </div>

        <div className="mt-8 min-h-0 flex-1">
          <PlanFeatureList plan={plan} />
        </div>

        <button
          type="button"
          onClick={onCtaClick}
          className={`relative mt-8 inline-flex h-12 w-full shrink-0 items-center justify-center rounded-btn text-[15px] font-semibold transition-all duration-200 ease-premium hover:scale-[1.04] active:scale-[0.99] ${
            featured
              ? "bg-brand text-inverse shadow-[0_1px_2px_rgba(10,22,128,0.12)] hover:bg-brand-hover"
              : "border border-hairline bg-card text-ink hover:bg-surface"
          }`}
        >
          {plan.cta}
        </button>
      </div>
    </div>
  );
}
