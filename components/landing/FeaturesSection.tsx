"use client";

import type { LucideIcon } from "lucide-react";
import { FEATURES } from "@/lib/landing-data";
import FadeInSection from "@/components/landing/motion/FadeInSection";
import { StaggerGrid, StaggerItem } from "@/components/landing/motion/StaggerGrid";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group h-full rounded-card border border-hairline bg-card p-7 shadow-card transition-all duration-300 ease-premium hover:-translate-y-2 hover:border-brand/30 hover:shadow-card-hover">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-subtle text-brand ring-1 ring-brand/10 transition-colors group-hover:bg-brand group-hover:text-inverse">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>
      <h3 className="text-lg font-semibold tracking-title-tight text-navy">{title}</h3>
      <p className="mt-2.5 text-[15px] leading-relaxed text-ink2">{description}</p>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <FadeInSection id="features" className="landing-section">
      <div className="mx-auto max-w-2xl text-center">
        <p className="dash-section-label">핵심 기능</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-title-tight text-navy">
          동아리 회계의 모든 것을 한곳에서
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink2">
          AI가 반복 업무를 자동화하고, 총무부는 검토와 의사결정에 집중할 수 있습니다.
        </p>
      </div>

      <StaggerGrid className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <StaggerItem key={feature.title}>
            <FeatureCard {...feature} />
          </StaggerItem>
        ))}
      </StaggerGrid>
    </FadeInSection>
  );
}
