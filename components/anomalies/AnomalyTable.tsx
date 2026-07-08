"use client";

import { Paperclip } from "lucide-react";
import AnomalyReasonBadge from "@/components/anomalies/AnomalyReasonBadge";
import Card from "@/components/common/Card";
import type { Schedule } from "@/lib/group/group-types";
import { formatCurrency } from "@/lib/format";
import type { TransactionAnomalyGroup } from "@/lib/anomalies/anomaly-types";
import { resolveCategory, type Transaction } from "@/lib/transactions/transaction-types";

type AnomalyTableProps = {
  transactions: Transaction[];
  groups: Map<string, TransactionAnomalyGroup>;
  schedules: Schedule[];
  onSelect: (transaction: Transaction) => void;
  className?: string;
};

export default function AnomalyTable({
  transactions,
  groups,
  schedules,
  onSelect,
  className = "",
}: AnomalyTableProps) {
  const rows = [...transactions].sort((a, b) =>
    a.transactionDate < b.transactionDate ? 1 : a.transactionDate > b.transactionDate ? -1 : 0
  );

  return (
    <Card className={`min-w-0 ${className}`}>
      <h3 className="dash-card-title mb-5">거래 내역 및 이상감지 결과</h3>
      <div className="dash-table-scroll">
        <table className="w-full min-w-[880px] border-separate border-spacing-0">
          <thead>
            <tr className="text-left">
              <th className="dash-table-head w-[10%] pr-2">날짜</th>
              <th className="dash-table-head w-[14%] pr-2">가맹점명</th>
              <th className="dash-table-head w-[12%] pr-2 text-right">금액</th>
              <th className="dash-table-head w-[10%] pr-2">카테고리</th>
              <th className="dash-table-head w-[24%] pr-2">이상거래 사유</th>
              <th className="dash-table-head w-[8%] pr-2 text-center">영수증</th>
              <th className="dash-table-head w-[12%] pr-2">연결된 일정</th>
              <th className="dash-table-head w-[10%] text-right">상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((tx) => {
              const group = groups.get(tx.id);
              const schedule = tx.scheduleId
                ? schedules.find((s) => s.id === tx.scheduleId)
                : undefined;
              const reasonText = group
                ? Array.from(new Set(group.results.map((r) => r.title))).join(" · ")
                : "-";

              return (
                <tr
                  key={tx.id}
                  onClick={() => onSelect(tx)}
                  className="dash-table-row border-b border-hairline last:border-0"
                >
                  <td className="pr-2 tabular-nums text-muted">{tx.transactionDate}</td>
                  <td className="truncate pr-2 font-medium text-ink">{tx.merchant}</td>
                  <td className="pr-2 text-right font-semibold tabular-nums text-ink">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="truncate pr-2 text-ink2">{resolveCategory(tx.category)}</td>
                  <td className="truncate pr-2 text-[13px] text-ink2">{reasonText}</td>
                  <td className="pr-2 text-center">
                    <Paperclip
                      size={14}
                      strokeWidth={1.75}
                      className={`mx-auto ${tx.hasReceipt ? "text-success" : "text-disabled"}`}
                    />
                  </td>
                  <td className="truncate pr-2 text-ink2">{schedule?.title ?? "-"}</td>
                  <td className="text-right">
                    <AnomalyReasonBadge status={group?.primaryType ?? "NORMAL"} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
