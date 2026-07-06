type ProgressBarProps = {
  value: number;
  className?: string;
  barClassName?: string;
};

export default function ProgressBar({
  value,
  className = "",
  barClassName = "bg-brand",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-2.5 w-full overflow-hidden rounded-full bg-surface ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${barClassName}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
