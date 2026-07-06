/** Design System v2 — shared color class tokens */

export const BADGE_STYLES = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  info: "bg-info/10 text-info",
  accent: "bg-accent-subtle text-accent",
  navy: "bg-surface text-navy ring-1 ring-hairline",
} as const;

export type BadgeVariant = keyof typeof BADGE_STYLES;

export const KPI_STYLES = {
  primary: "font-semibold text-navy",
  highlight: "font-semibold text-brand",
  warning: "font-semibold text-warning",
  danger: "font-semibold text-danger",
  neutral: "font-semibold text-ink",
} as const;

export const BUTTON_STYLES = {
  primary:
    "bg-brand text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)] hover:brightness-95 active:brightness-90",
  secondary: "border border-hairline bg-card text-ink hover:bg-surface",
  ghost: "bg-transparent text-ink2 hover:bg-surface hover:text-navy",
  danger: "bg-danger text-inverse hover:brightness-95 active:brightness-90",
} as const;

export const NAV_ACTIVE = "font-medium text-navy bg-surface";
export const NAV_INACTIVE = "text-ink2 hover:bg-surface hover:text-navy";
