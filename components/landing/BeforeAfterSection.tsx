"use client";

import type { LucideIcon } from "lucide-react";
import { AFTER_PANEL, BEFORE_PANEL, type ComparisonPanel } from "@/lib/landing-data";
import FadeInSection from "@/components/landing/motion/FadeInSection";
import { StaggerGrid, StaggerItem } from "@/components/landing/motion/StaggerGrid";

function ComparisonItemRow({
  icon: Icon,
  title,
  description,
  variant,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  variant: "before" | "after";
}) {
  const isAfter = variant === "after";

  return (
    <li className="flex gap-3">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
          isAfter
            ? "bg-brand/10 text-brand"
            : "bg-ink/5 text-ink2"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
      <div className="min-w-0">
        <p
          className={`text-[14px] font-semibold leading-snug tracking-title-tight ${
            isAfter ? "text-navy" : "text-ink"
          }`}
        >
          {title}
        </p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-ink2">{description}</p>
      </div>
    </li>
  );
}

function ComparisonCard({
  panel,
  variant,
}: {
  panel: ComparisonPanel;
  variant: "before" | "after";
}) {
  const isAfter = variant === "after";

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-5 transition-all duration-300 ease-premium sm:p-6 ${
        isAfter
          ? "border-brand/25 bg-card shadow-[0_8px_40px_rgba(10,22,128,0.10)] ring-1 ring-brand/10 hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(10,22,128,0.14)]"
          : "border-hairline bg-surface/60 hover:-translate-y-0.5 hover:shadow-card"
      }`}
    >
      {isAfter && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-50"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(10,22,128,0.08) 0%, transparent 70%)",
          }}
          aria-hidden
        />
      )}

      <div className="relative">
        <h3
          className={`text-lg font-bold tracking-title-tight ${
            isAfter ? "text-brand" : "text-ink"
          }`}
        >
          {panel.label}
        </h3>

        <ul className="mt-4 space-y-3.5">
          {panel.items.map((item) => (
            <ComparisonItemRow key={item.title} {...item} variant={variant} />
          ))}
        </ul>

        <div
          className={`mt-5 flex items-baseline justify-between gap-3 border-t pt-4 ${
            isAfter ? "border-brand/15" : "border-hairline"
          }`}
        >
          <span className="text-xs font-medium text-muted">{panel.metric.label}</span>
          <span
            className={`text-base font-bold tabular-nums tracking-title-tight ${
              isAfter ? "text-brand" : "text-ink2"
            }`}
          >
            {panel.metric.value}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterSection() {
  return (
    <FadeInSection className="landing-section">
      <div className="mx-auto max-w-2xl text-center">
        <p className="dash-section-label">Before / After</p>
        <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.25rem)] font-bold tracking-title-tight text-navy">
          회계 관리, 이렇게 달라집니다
        </h2>
      </div>

      <StaggerGrid className="relative mt-12 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr] md:gap-5 lg:mt-14">
        <StaggerItem>
          <ComparisonCard panel={BEFORE_PANEL} variant="before" />
        </StaggerItem>

        <StaggerItem className="flex items-center justify-center py-2 md:py-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline bg-card text-[11px] font-bold tracking-wide text-muted shadow-sm">
            VS
          </div>
        </StaggerItem>

        <StaggerItem>
          <ComparisonCard panel={AFTER_PANEL} variant="after" />
        </StaggerItem>
      </StaggerGrid>
    </FadeInSection>
  );
}
