"use client";

import { useEffect, useMemo } from "react";
import { Paperclip, X } from "lucide-react";
import StatusBadge from "@/components/common/StatusBadge";
import { CATEGORY_COLORS } from "@/lib/chart-colors";
import type { BudgetCategory, DashboardTransaction } from "@/lib/dashboard-types";
import type { BudgetTrendFilter } from "@/lib/budget-monthly-data";
import { formatCurrency } from "@/lib/format";

type MonthlyTransactionsModalProps = {
  open: boolean;
  monthLabel: string;
  filter: BudgetTrendFilter;
  transactions: DashboardTransaction[];
  onClose: () => void;
  onSelect: (transaction: DashboardTransaction) => void;
};

export default function MonthlyTransactionsModal({
  open,
  monthLabel,
  filter,
  transactions,
  onClose,
  onSelect,
}: MonthlyTransactionsModalProps) {
  const total = useMemo(
    () => transactions.reduce((sum, tx) => sum + tx.amount, 0),
    [transactions]
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const filterLabel = filter === "전체" ? "전체" : filter;
  const accentColor =
    filter === "전체" ? "#0A1680" : CATEGORY_COLORS[filter as BudgetCategory];

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[90] flex max-h-[85vh] w-[min(720px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="monthly-transactions-title"
      >
        <div className="shrink-0 border-b border-hairline px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[12px] font-medium text-muted">2026년 1학기</p>
              <h2
                id="monthly-transactions-title"
                className="mt-1 text-[18px] font-semibold tracking-title-tight text-navy"
              >
                {monthLabel} {filterLabel} 결제내역
              </h2>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium text-inverse"
                  style={{ backgroundColor: accentColor }}
                >
                  {filterLabel}
                </span>
                <p className="text-[14px] tabular-nums text-ink2">
                  총 {transactions.length}건 ·{" "}
                  <span className="font-semibold text-navy">{formatCurrency(total)}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ui-icon-btn shrink-0"
              aria-label="닫기"
            >
              <X size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[15px] font-medium text-ink">결제내역이 없습니다</p>
              <p className="mt-2 text-[13px] text-muted">
                {monthLabel}에 {filterLabel} 카테고리 거래가 없습니다.
              </p>
            </div>
          ) : (
            <table className="w-full table-fixed border-separate border-spacing-0">
              <thead>
                <tr className="text-left">
                  <th className="dash-table-head w-[26%] pr-2">거래처</th>
                  {filter === "전체" && (
                    <th className="dash-table-head w-[14%] pr-2">카테고리</th>
                  )}
                  <th className="dash-table-head w-[14%] pr-2">날짜</th>
                  <th className="dash-table-head w-[18%] pr-2 text-right">금액</th>
                  <th className="dash-table-head w-[14%] pr-2 text-right">상태</th>
                  <th className="dash-table-head w-[14%] text-right">영수증</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    onClick={() => onSelect(tx)}
                    className="dash-table-row cursor-pointer border-b border-hairline last:border-0"
                  >
                    <td className="truncate pr-2 font-medium text-ink">{tx.merchant}</td>
                    {filter === "전체" && (
                      <td className="truncate pr-2 text-ink2">{tx.category}</td>
                    )}
                    <td className="truncate pr-2 tabular-nums text-muted">{tx.dateLabel}</td>
                    <td className="truncate pr-2 text-right font-semibold tabular-nums text-ink">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="pr-2 text-right">
                      <StatusBadge status={tx.status} />
                    </td>
                    <td className="text-right">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          tx.hasReceipt
                            ? "bg-success/10 text-success"
                            : "bg-surface text-muted"
                        }`}
                      >
                        <Paperclip size={11} strokeWidth={1.75} />
                        {tx.hasReceipt ? "첨부됨" : "없음"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
