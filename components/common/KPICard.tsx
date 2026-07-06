type KPICardProps = {
  label: string;
  value: string;
  description: string;
  tone?: "navy" | "warning" | "danger" | "accent";
};

const toneClasses = {
  navy: "text-navy",
  warning: "text-warning",
  danger: "text-danger",
  accent: "text-accent",
};

export default function KPICard({
  label,
  value,
  description,
  tone = "navy",
}: KPICardProps) {
  return (
    <div className="min-w-0 rounded-2xl bg-appbg p-4 ring-1 ring-hairline transition-transform duration-200 ease-premium hover:scale-[1.01]">
      <p className="text-[11px] font-medium uppercase tracking-label-wide text-muted">
        {label}
      </p>
      <p
        className={`mt-2 text-[clamp(1.35rem,2vw,1.75rem)] font-bold leading-none tracking-title-tight tabular-nums ${toneClasses[tone]}`}
      >
        {value}
      </p>
      <p className="mt-2 text-[13px] leading-snug text-ink2">{description}</p>
    </div>
  );
}
