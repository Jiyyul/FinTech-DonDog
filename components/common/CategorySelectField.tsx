import { OPENAI_CLASSIFY_CATEGORIES } from "@/lib/openai-classify";
import type { BudgetCategory } from "@/lib/dashboard-types";

const selectClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)] disabled:cursor-not-allowed disabled:opacity-60";

type CategorySelectFieldProps = {
  value: BudgetCategory;
  onChange: (category: BudgetCategory) => void;
  disabled?: boolean;
  label?: string;
};

export default function CategorySelectField({
  value,
  onChange,
  disabled = false,
  label = "카테고리",
}: CategorySelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as BudgetCategory)}
        disabled={disabled}
        className={selectClass}
      >
        {OPENAI_CLASSIFY_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </label>
  );
}
