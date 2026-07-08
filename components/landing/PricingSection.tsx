"use client";

import { Check } from "lucide-react";
import Badge from "@/components/common/Badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { PRICING_PLANS } from "@/lib/landing-data";
import FadeInSection from "@/components/landing/motion/FadeInSection";
import { StaggerGrid, StaggerItem } from "@/components/landing/motion/StaggerGrid";

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  featured,
  cta,
  onCtaClick,
}: (typeof PRICING_PLANS)[number] & { onCtaClick: () => void }) {
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

      <div className="relative">
        <h3 className="text-xl font-bold tracking-title-tight text-navy">{name}</h3>
        <p className="mt-2 text-sm text-ink2">{description}</p>
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-title-tight text-navy">
            {price}
          </span>
          {period !== "맞춤" && (
            <span className="text-sm text-muted">/ {period}</span>
          )}
        </div>

        <ul className="mt-8 flex-1 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-[14px] text-ink2">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {feature}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onCtaClick}
          className={`relative mt-8 inline-flex h-12 w-full items-center justify-center rounded-btn text-[15px] font-semibold transition-all duration-200 ease-premium hover:scale-[1.04] active:scale-[0.99] ${
            featured
              ? "bg-brand text-inverse shadow-[0_1px_2px_rgba(10,22,128,0.12)] hover:bg-brand-hover"
              : "border border-hairline bg-card text-ink hover:bg-surface"
          }`}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}

export default function PricingSection() {
  const { openAuth } = useAuth();

  return (
    <FadeInSection
      id="pricing"
      className="landing-section"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="dash-section-label">요금제</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-title-tight text-navy">
          동아리 규모에 맞는 플랜
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink2">
          무료로 시작하고, 필요할 때 업그레이드하세요.
        </p>
      </div>

      <StaggerGrid className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {PRICING_PLANS.map((plan) => (
          <StaggerItem key={plan.id} className={plan.featured ? "lg:py-2" : ""}>
            <PricingCard {...plan} onCtaClick={() => openAuth("signup")} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </FadeInSection>
  );
}
