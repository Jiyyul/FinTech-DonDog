type AvatarProps = {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-9 w-9 text-[12px]",
  lg: "h-10 w-10 text-[12px]",
};

export default function Avatar({
  initials,
  size = "md",
  className = "",
}: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-surface font-semibold text-ink2 ring-1 ring-hairline ${sizeClasses[size]} ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  );
}
