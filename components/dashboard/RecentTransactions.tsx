"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Card from "@/components/common/Card";
import StatusBadge from "@/components/common/StatusBadge";
import { RECENT_TRANSACTIONS } from "@/lib/dashboard-mock-data";
import { formatCurrency } from "@/lib/format";
import type { DashboardTransaction } from "@/lib/dashboard-types";

type RecentTransactionsProps = {
  onSelect: (transaction: DashboardTransaction) => void;
  className?: string;
};

export default function RecentTransactions({
  onSelect,
  className = "",
}: RecentTransactionsProps) {
  return (
    <Card className={`flex min-h-[580px] min-w-0 flex-col ${className}`}>
      <div className="mb-6 flex shrink-0 flex-wrap items-center justify-between gap-3">
        <h3 className="dash-card-title">최근 거래내역</h3>
        <Link
          href="/transactions"
          className="group flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors duration-200 hover:text-ink"
        >
          전체보기
          <ArrowRight
            size={14}
            strokeWidth={1.5}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="dash-table-scroll min-h-0 flex-1">
        <table className="w-full min-w-[640px] border-separate border-spacing-0">
          <thead className="sticky top-0 bg-card">
            <tr className="text-left">
              <th className="dash-table-head pr-6">거래처</th>
              <th className="dash-table-head pr-6">AI 분류</th>
              <th className="dash-table-head pr-6">날짜</th>
              <th className="dash-table-head pr-6 text-right">금액</th>
              <th className="dash-table-head text-right">상태</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_TRANSACTIONS.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => onSelect(tx)}
                className="dash-table-row border-b border-hairline last:border-0"
              >
                <td className="pr-6 font-medium text-ink">{tx.merchant}</td>
                <td className="pr-6 text-ink2">{tx.category}</td>
                <td className="pr-6 tabular-nums text-muted">{tx.dateLabel}</td>
                <td className="pr-6 text-right font-semibold tabular-nums text-ink">
                  {formatCurrency(tx.amount)}
                </td>
                <td className="text-right">
                  <StatusBadge status={tx.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
