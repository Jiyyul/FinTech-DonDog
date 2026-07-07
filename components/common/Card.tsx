import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function Card({ children, className = "", style }: CardProps) {
  return (
    <div
      style={style}
      className={`min-w-0 rounded-card border border-hairline bg-card p-7 shadow-card transition-[box-shadow,transform] duration-card ease-premium hover:scale-[1.01] hover:shadow-card-hover ${className}`}
    >
      {children}
    </div>
  );
}
