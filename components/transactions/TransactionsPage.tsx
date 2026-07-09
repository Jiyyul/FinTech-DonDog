"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Paperclip } from "lucide-react";
import Card from "@/components/common/Card";
import StatusBadge from "@/components/common/StatusBadge";
import TransactionDrawer from "@/components/dashboard/TransactionDrawer";
import { useAuth } from "@/components/providers/AuthProvider";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { formatCurrency } from "@/lib/format";
import type { DashboardTransaction } from "@/lib/dashboard-types";

export default function TransactionsPage() {
  const router = useRouter();
  const { canEdit } = useAuth();
  const [selected, setSelected] = useState<DashboardTransaction | null>(null);
  const { allTransactions: transactions, currentAccountBalance } = useDashboardData();
  const totalExpense = transactions.reduce((s, t) => s + t.amount, 0);

  const headers = canEdit
    ? ["결제명", "AI 분류", "날짜", "금액", "잔액", "상태", "영수증"]
    : ["결제명", "AI 분류", "날짜", "금액", "잔액", "상태"];

  return (
    <div className="mx-auto max-w-5xl pb-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-ink2 transition-colors duration-200 hover:text-navy"
      >
        <ArrowLeft size={18} strokeWidth={1.75} />
        대시보드
      </Link>

      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="dash-section-label normal-case tracking-normal">결제 내역</p>
          <h1 className="ui-page-title mt-1">전체 거래내역</h1>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-muted">현재 잔액</p>
          <p className="text-[22px] font-bold tabular-nums text-navy">
            {formatCurrency(currentAccountBalance)}
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card className="!p-5">
          <p className="text-[13px] text-muted">총 지출</p>
          <p className="mt-1 text-[20px] font-bold tabular-nums text-navy">
            {formatCurrency(totalExpense)}
          </p>
        </Card>
        <Card className="!p-5">
          <p className="text-[13px] text-muted">거래 건수</p>
          <p className="mt-1 text-[20px] font-bold tabular-nums text-navy">
            {transactions.length}건
          </p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-0">
            <thead>
              <tr className="text-left">
                {headers.map((h) => (
                  <th key={h} className="dash-table-head px-2 first:pl-0 last:pr-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...transactions].reverse().map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => setSelected(tx)}
                  className="dash-table-row cursor-pointer border-b border-hairline last:border-0"
                >
                  <td className="truncate px-2 py-3 font-medium text-ink first:pl-0">
                    {tx.merchant}
                  </td>
                  <td className="truncate px-2 text-ink2">{tx.category}</td>
                  <td className="truncate px-2 tabular-nums text-muted">{tx.dateLabel}</td>
                  <td className="truncate px-2 text-right font-semibold tabular-nums text-ink">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="truncate px-2 text-right tabular-nums text-ink2">
                    {formatCurrency(tx.balance)}
                  </td>
                  <td className="px-2 text-right">
                    <StatusBadge status={tx.status} />
                  </td>
                  {canEdit && (
                    <td className="px-2 text-right last:pr-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            tx.hasReceipt ? "/receipts" : `/receipts?transactionId=${tx.id}`
                          );
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
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <TransactionDrawer
        open={!!selected}
        transaction={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
