"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import StatusBadge from "@/components/common/StatusBadge";
import AIMessage from "@/components/common/AIMessage";
import { formatCurrency } from "@/lib/format";
import type { DashboardTransaction } from "@/lib/dashboard-types";

type TransactionDrawerProps = {
  open: boolean;
  transaction: DashboardTransaction | null;
  onClose: () => void;
};

export default function TransactionDrawer({
  open,
  transaction,
  onClose,
}: TransactionDrawerProps) {
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

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/25 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-screen w-full max-w-[400px] flex-col border-l border-hairline bg-card shadow-[-4px_0_32px_rgba(16,24,40,0.06)] transition-transform duration-300 ease-premium ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal
        aria-label="거래 상세정보"
      >
        {transaction && (
          <>
            <div className="flex items-center justify-between border-b border-hairline px-7 py-5">
              <h2 className="text-[16px] font-semibold tracking-title-tight text-navy">
                거래 상세정보
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="ui-icon-btn"
                aria-label="닫기"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6">
              <div className="mb-6">
                <p className="text-[28px] font-semibold tracking-title-tight text-navy tabular-nums">
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="mt-1 text-[15px] font-medium text-ink">
                  {transaction.merchant}
                </p>
                <div className="mt-3">
                  <StatusBadge status={transaction.status} />
                </div>
              </div>

              <div className="space-y-4 border-t border-hairline pt-6">
                <DrawerField label="AI 분류" value={transaction.category} />
                <DrawerField label="날짜" value={transaction.dateLabel} />
                <DrawerField
                  label="결제수단"
                  value={transaction.paymentMethod ?? "-"}
                />
                <DrawerField
                  label="거래번호"
                  value={transaction.transactionId ?? "-"}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-surface p-4 ring-1 ring-hairline">
                <AIMessage>행사비로 분류했어요. 신뢰도 97%</AIMessage>
              </div>
            </div>

            <div className="border-t border-hairline px-7 py-4">
              {transaction.status === "review" ? (
                <Button variant="primary" className="w-full" onClick={onClose}>
                  검토하기
                </Button>
              ) : (
                <Button variant="secondary" className="w-full" onClick={onClose}>
                  닫기
                </Button>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function DrawerField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1 text-[15px] font-medium text-ink">{value}</p>
    </div>
  );
}
