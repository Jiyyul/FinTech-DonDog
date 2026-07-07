"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Paperclip, X } from "lucide-react";
import Card from "@/components/common/Card";
import StatusBadge from "@/components/common/StatusBadge";
import { ALL_TRANSACTIONS } from "@/lib/dashboard-mock-data";
import { formatCurrency } from "@/lib/format";
import type { DashboardTransaction } from "@/lib/dashboard-types";

type RecentTransactionsProps = {
  transactions: DashboardTransaction[];
  onSelect: (transaction: DashboardTransaction) => void;
  onAddReceipt: (transaction: DashboardTransaction) => void;
  className?: string;
};

function TransactionsTable({
  rows,
  onSelect,
  onAddReceipt,
}: {
  rows: DashboardTransaction[];
  onSelect: (transaction: DashboardTransaction) => void;
  onAddReceipt: (transaction: DashboardTransaction) => void;
}) {
  return (
    <table className="w-full table-fixed border-separate border-spacing-0">
      <thead>
        <tr className="text-left">
          <th className="dash-table-head w-[24%] pr-2">거래처</th>
          <th className="dash-table-head w-[14%] pr-2">AI 분류</th>
          <th className="dash-table-head w-[12%] pr-2">날짜</th>
          <th className="dash-table-head w-[18%] pr-2 text-right">금액</th>
          <th className="dash-table-head w-[14%] pr-2 text-right">검토 상태</th>
          <th className="dash-table-head w-[18%] text-right">영수증</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((tx) => (
          <tr
            key={tx.id}
            onClick={() => onSelect(tx)}
            className="dash-table-row border-b border-hairline last:border-0"
          >
            <td className="truncate pr-2 font-medium text-ink">{tx.merchant}</td>
            <td className="truncate pr-2 text-ink2">{tx.category}</td>
            <td className="truncate pr-2 tabular-nums text-muted">{tx.dateLabel}</td>
            <td className="truncate pr-2 text-right font-semibold tabular-nums text-ink">
              {formatCurrency(tx.amount)}
            </td>
            <td className="pr-2 text-right">
              <StatusBadge status={tx.status} />
            </td>
            <td className="text-right">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddReceipt(tx);
                }}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-200 ${
                  tx.hasReceipt
                    ? "bg-success/10 text-success"
                    : "bg-surface text-ink2 hover:ring-1 hover:ring-hairline hover:text-ink"
                }`}
              >
                <Paperclip size={11} strokeWidth={1.75} />
                {tx.hasReceipt ? "첨부됨" : "영수증 추가"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function RecentTransactions({
  transactions,
  onSelect,
  onAddReceipt,
  className = "",
}: RecentTransactionsProps) {
  const [viewAllOpen, setViewAllOpen] = useState(false);

  useEffect(() => {
    if (viewAllOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [viewAllOpen]);

  return (
    <>
      <Card className={`flex min-w-0 flex-col ${className}`}>
        <div className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3">
          <h3 className="dash-card-title">최근 거래내역</h3>
          <button
            type="button"
            onClick={() => setViewAllOpen(true)}
            className="group flex items-center gap-1.5 text-[13px] font-medium text-muted transition-colors duration-200 hover:text-ink"
          >
            전체보기
            <ArrowRight
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <TransactionsTable
            rows={transactions}
            onSelect={onSelect}
            onAddReceipt={onAddReceipt}
          />
        </div>
      </Card>

      {viewAllOpen && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
            onClick={() => setViewAllOpen(false)}
            aria-hidden
          />
          <div
            className="fixed left-1/2 top-1/2 z-[90] flex max-h-[85vh] w-[min(900px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
            role="dialog"
            aria-modal
            aria-labelledby="all-transactions-title"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-hairline px-6 py-5">
              <h2
                id="all-transactions-title"
                className="text-[18px] font-semibold tracking-title-tight text-navy"
              >
                전체 거래내역
              </h2>
              <button
                type="button"
                onClick={() => setViewAllOpen(false)}
                className="ui-icon-btn"
                aria-label="닫기"
              >
                <X size={20} strokeWidth={1.75} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <TransactionsTable
                rows={ALL_TRANSACTIONS}
                onSelect={(tx) => {
                  setViewAllOpen(false);
                  onSelect(tx);
                }}
                onAddReceipt={(tx) => {
                  setViewAllOpen(false);
                  onAddReceipt(tx);
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
