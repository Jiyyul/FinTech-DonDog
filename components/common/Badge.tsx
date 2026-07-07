import { BADGE_STYLES, type BadgeVariant } from "@/lib/design-tokens";

type BadgeProps = {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
};

const sizeClasses = {
  sm: "h-6 px-2.5 text-[11px]",
  md: "h-7 px-3 text-xs",
};

export default function Badge({
  variant,
  children,
  className = "",
  size = "md",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${BADGE_STYLES[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}
