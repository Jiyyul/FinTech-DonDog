"use client";

import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import { formatCurrency } from "@/lib/format";
import type { MatchCandidate } from "@/lib/receipts/receipt-types";
import { resolveCategory, type Transaction } from "@/lib/transactions/transaction-types";

type ReceiptMatchCandidatesProps = {
  candidates: MatchCandidate[];
  transactions: Transaction[];
  selectedTransactionId: string | null;
  onSelect: (transactionId: string) => void;
};

export default function ReceiptMatchCandidates({
  candidates,
  transactions,
  selectedTransactionId,
  onSelect,
}: ReceiptMatchCandidatesProps) {
  return (
    <Card>
      <h3 className="dash-card-title mb-1">매칭 후보 거래</h3>
      <p className="mb-5 text-[13px] text-muted">
        조건이 2개 이상 일치하는 거래를 후보로 보여줍니다. 연결할 거래를 직접 선택하세요.
      </p>

      {candidates.length === 0 ? (
        <div className="dash-inner-surface">
          <p className="text-[14px] text-ink2">
            매칭되는 거래가 없습니다. 연결 없이 저장할 수 있습니다.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {candidates.map((candidate) => {
            const tx = transactions.find((t) => t.id === candidate.transactionId);
            if (!tx) return null;
            const isSelected = selectedTransactionId === candidate.transactionId;

            return (
              <li key={candidate.transactionId}>
                <button
                  type="button"
                  onClick={() => onSelect(candidate.transactionId)}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-brand/40 bg-brand-subtle/30 ring-1 ring-brand/20"
                      : "border-hairline bg-surface hover:ring-1 hover:ring-hairline"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-ink">{tx.merchant}</p>
                      <p className="mt-0.5 text-[12px] text-muted">
                        {tx.transactionDate} · {resolveCategory(tx.category)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-[14px] font-semibold tabular-nums text-navy">
                        {formatCurrency(tx.amount)}
                      </span>
                      <Badge variant={candidate.score >= 70 ? "success" : "info"} size="sm">
                        {candidate.score}점
                      </Badge>
                    </div>
                  </div>
                  <ul className="mt-2 space-y-0.5">
                    {candidate.reasons.map((reason, i) => (
                      <li key={i} className="text-[12px] text-muted">
                        · {reason}
                      </li>
                    ))}
                  </ul>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
