import type { ButtonHTMLAttributes, ReactNode } from "react";
import { BUTTON_STYLES } from "@/lib/design-tokens";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
  icon?: ReactNode;
};

export default function Button({
  variant = "primary",
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-12 items-center justify-center gap-2 rounded-btn px-5 text-[15px] font-semibold tracking-[-0.01em] transition-all duration-200 ease-premium hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 ${BUTTON_STYLES[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
