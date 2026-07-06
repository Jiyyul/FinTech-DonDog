import { Search } from "lucide-react";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  placeholder = "거래처, 항목 검색",
  className = "",
}: SearchBarProps) {
  return (
    <div
      className={`flex h-12 min-w-0 items-center gap-2.5 rounded-btn border border-hairline bg-card px-3.5 shadow-card transition-all duration-200 ease-premium focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(196,255,77,0.2)] ${className}`}
    >
      <Search size={18} className="shrink-0 text-muted" strokeWidth={1.5} />
      <input
        type="search"
        placeholder={placeholder}
        className="min-w-0 w-full border-none bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
        aria-label="검색"
      />
    </div>
  );
}
