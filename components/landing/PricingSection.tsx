"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { usePayment } from "@/components/payment/PaymentProvider";
import PlanPricingCard from "@/components/plans/PlanPricingCard";
import { isPaymentPlanId, type PaymentPlanId } from "@/lib/payment-data";
import { PLANS_LIST } from "@/lib/plans";
import FadeInSection from "@/components/landing/motion/FadeInSection";
import { StaggerGrid, StaggerItem } from "@/components/landing/motion/StaggerGrid";

export default function PricingSection() {
  const { openAuth } = useAuth();
  const { openPayment } = usePayment();

  const handlePlanClick = (planId: string) => {
    if (isPaymentPlanId(planId)) {
      openPayment(planId as PaymentPlanId);
      return;
    }

    openAuth("signup");
  };

  return (
    <FadeInSection id="pricing" className="landing-section">
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
        {PLANS_LIST.map((plan) => (
          <StaggerItem key={plan.id} className={plan.featured ? "lg:py-2" : ""}>
            <PlanPricingCard plan={plan} onCtaClick={() => handlePlanClick(plan.id)} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </FadeInSection>
  );
}
