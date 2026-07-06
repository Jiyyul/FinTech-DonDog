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
    <Card className={`flex min-w-0 flex-col ${className}`}>
      <div className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
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

      <div className="min-w-0 flex-1">
        <table className="w-full table-fixed border-separate border-spacing-0">
          <thead>
            <tr className="text-left">
              <th className="dash-table-head w-[28%] pr-3">거래처</th>
              <th className="dash-table-head w-[18%] pr-3">AI 분류</th>
              <th className="dash-table-head w-[14%] pr-3">날짜</th>
              <th className="dash-table-head w-[22%] pr-3 text-right">금액</th>
              <th className="dash-table-head w-[18%] text-right">상태</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_TRANSACTIONS.map((tx) => (
              <tr
                key={tx.id}
                onClick={() => onSelect(tx)}
                className="dash-table-row border-b border-hairline last:border-0"
              >
                <td className="truncate pr-3 font-medium text-ink">
                  {tx.merchant}
                </td>
                <td className="truncate pr-3 text-ink2">{tx.category}</td>
                <td className="truncate pr-3 tabular-nums text-muted">
                  {tx.dateLabel}
                </td>
                <td className="truncate pr-3 text-right font-semibold tabular-nums text-ink">
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
