"use client";

import { Fragment } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { STEPS } from "@/lib/landing-data";
import FadeInSection from "@/components/landing/motion/FadeInSection";
import { StaggerGrid, StaggerItem } from "@/components/landing/motion/StaggerGrid";

function StepCard({
  number,
  icon: Icon,
  title,
  description,
}: {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex h-full flex-col rounded-card border border-hairline bg-card p-5 shadow-card transition-all duration-300 ease-premium hover:-translate-y-2 hover:shadow-card-hover sm:p-6">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-inverse">
          {number}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface text-brand">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
      </div>
      <h3 className="text-[15px] font-semibold tracking-title-tight text-navy sm:text-[17px]">
        {title}
      </h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-ink2 sm:text-[14px]">
        {description}
      </p>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <FadeInSection
      id="how-it-works"
      className="landing-section"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="dash-section-label">사용 방법</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-title-tight text-navy">
          5단계로 시작하는 스마트 회계
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-ink2">
          가입부터 실시간 공유까지, 누구나 쉽게 따라할 수 있습니다.
        </p>
      </div>

      <div className="mt-14 -mx-6 overflow-x-auto px-6 pb-2 min-[1200px]:mx-0 min-[1200px]:overflow-visible min-[1200px]:px-0">
        <StaggerGrid className="flex min-w-max items-stretch gap-2 sm:gap-3 min-[1200px]:min-w-0 min-[1200px]:w-full min-[1200px]:justify-between">
          {STEPS.map((step, index) => (
            <Fragment key={step.number}>
              <StaggerItem className="w-[168px] shrink-0 sm:w-[190px] min-[1200px]:w-auto min-[1200px]:min-w-0 min-[1200px]:max-w-[220px] min-[1200px]:flex-1">
                <StepCard {...step} />
              </StaggerItem>
              {index < STEPS.length - 1 && (
                <div
                  className="flex shrink-0 items-center self-center px-0.5 text-muted"
                  aria-hidden
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.75} />
                </div>
              )}
            </Fragment>
          ))}
        </StaggerGrid>
      </div>
    </FadeInSection>
  );
}
