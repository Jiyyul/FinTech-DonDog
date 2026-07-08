import Card from "@/components/common/Card";
import Badge from "@/components/common/Badge";
import { formatCurrency } from "@/lib/format";
import { ANOMALY_QUEUE } from "@/lib/dashboard-mock-data";
import { ANOMALY_TYPE_LABELS } from "@/lib/dashboard-types";

/**
 * 랜딩 페이지 목업 전용 정적 카드. 실제 대시보드의 AuditCard(Supabase 연동)와는
 * 별개로, lib/dashboard-mock-data.ts의 정적 데모 데이터만 사용한다.
 */
export default function AuditCardPreview() {
  const current = ANOMALY_QUEUE[0];

  return (
    <Card className="flex min-w-0 flex-col !p-4 hover:scale-100 hover:shadow-card">
      <div className="mb-3 flex shrink-0 items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent-subtle text-sm ring-1 ring-accent/20"
            aria-hidden
          >
            🐶
          </span>
          <h3 className="dash-card-title min-w-0">AI 이상감지</h3>
        </div>
        {ANOMALY_QUEUE.length > 0 && (
          <Badge variant="warning" size="sm" className="uppercase tracking-label-wide">
            {ANOMALY_QUEUE.length}건
          </Badge>
        )}
      </div>

      {current && (
        <div className="rounded-2xl border border-hairline bg-surface px-3.5 py-3">
          <p className="truncate text-[13px] font-semibold text-ink">
            {current.transaction.merchant}
          </p>
          <p className="mt-0.5 text-[12px] tabular-nums text-ink2">
            {formatCurrency(current.transaction.amount)}
          </p>
          <p className="mt-2 truncate text-[11px] font-medium text-warning">
            {ANOMALY_TYPE_LABELS[current.type]}
          </p>
        </div>
      )}
    </Card>
  );
}
