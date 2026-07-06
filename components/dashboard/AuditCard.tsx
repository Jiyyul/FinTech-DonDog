import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { PENDING_AUDIT_TRANSACTION } from "@/lib/dashboard-mock-data";
import { formatCurrency } from "@/lib/format";

type AuditCardProps = {
  onReview: () => void;
  className?: string;
};

export default function AuditCard({ onReview, className = "" }: AuditCardProps) {
  const tx = PENDING_AUDIT_TRANSACTION;

  return (
    <Card className={`flex min-w-0 flex-col ${className}`}>
      <div className="mb-5 flex shrink-0 items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-subtle text-sm ring-1 ring-accent/20"
            aria-hidden
          >
            🐶
          </span>
          <h3 className="dash-card-title min-w-0">AI Audit</h3>
        </div>
        <Badge variant="warning" size="sm" className="uppercase tracking-label-wide">
          Review
        </Badge>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center">
        <p className="dash-section-label normal-case tracking-normal">
          확인 필요한 거래
        </p>
        <p className="mt-1.5 dash-metric-xl">
          1<span className="ml-1 text-[18px] font-medium text-muted">건</span>
        </p>

        <div className="dash-inner-surface mt-5">
          <p className="text-[14px] font-medium text-ink">{tx.merchant}</p>
          <p className="mt-1.5 text-[22px] font-semibold tracking-title-tight text-navy tabular-nums">
            {formatCurrency(tx.amount)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="info" size="sm">
              {tx.category}
            </Badge>
            <Badge variant="warning" size="sm">
              회칙 확인 필요
            </Badge>
          </div>
        </div>
      </div>

      <Button variant="primary" className="mt-5 w-full shrink-0" onClick={onReview}>
        검토하기
      </Button>
    </Card>
  );
}
