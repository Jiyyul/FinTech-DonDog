import Badge from "@/components/common/Badge";
import { STATUS_BADGE_CONFIG, type TransactionStatus } from "@/lib/anomalies/anomaly-types";

type AnomalyReasonBadgeProps = {
  status: TransactionStatus;
  size?: "sm" | "md";
};

export default function AnomalyReasonBadge({ status, size = "sm" }: AnomalyReasonBadgeProps) {
  const config = STATUS_BADGE_CONFIG[status];

  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
}
