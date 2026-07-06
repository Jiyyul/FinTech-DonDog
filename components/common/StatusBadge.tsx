import type { TransactionStatus } from "@/lib/dashboard-types";
import Badge from "@/components/common/Badge";

type StatusBadgeProps = {
  status: TransactionStatus;
  label?: string;
};

const config: Record<
  TransactionStatus,
  { label: string; variant: "success" | "info" | "warning" }
> = {
  completed: { label: "완료", variant: "success" },
  pending: { label: "승인대기", variant: "info" },
  review: { label: "검토 필요", variant: "warning" },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const { label: defaultLabel, variant } = config[status];

  return <Badge variant={variant}>{label ?? defaultLabel}</Badge>;
}
