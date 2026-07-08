type AIMessageProps = {
  children: React.ReactNode;
  className?: string;
};

export default function AIMessage({ children, className = "" }: AIMessageProps) {
  return (
    <div className={`flex items-start gap-2.5 ${className}`}>
      <span
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-[11px] leading-none"
        aria-hidden
      >
        🐶
      </span>
      <p className="dash-body pt-px">{children}</p>
    </div>
  );
}
