"use client";

import Badge from "@/components/common/Badge";
import Card from "@/components/common/Card";
import { formatCurrency } from "@/lib/format";
import type { Receipt } from "@/lib/receipts/receipt-types";

type ReceiptListProps = {
  receipts: Receipt[];
};

export default function ReceiptList({ receipts }: ReceiptListProps) {
  return (
    <Card>
      <h3 className="dash-card-title mb-5">저장된 영수증</h3>
      {receipts.length === 0 ? (
        <p className="text-[14px] text-ink2">아직 등록된 영수증이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {receipts.map((receipt) => (
            <li
              key={receipt.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-hairline bg-surface px-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="truncate text-[14px] font-medium text-ink">{receipt.merchant}</p>
                <p className="mt-0.5 text-[12px] text-muted">
                  {receipt.purchasedAt} · {receipt.fileName}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-[14px] font-semibold tabular-nums text-navy">
                  {formatCurrency(receipt.totalAmount)}
                </span>
                <Badge variant={receipt.linkedTransactionId ? "success" : "warning"} size="sm">
                  {receipt.linkedTransactionId ? "연결됨" : "미연결"}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
