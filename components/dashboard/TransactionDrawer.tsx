"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import CategorySelectField from "@/components/common/CategorySelectField";
import StatusBadge from "@/components/common/StatusBadge";
import AIMessage from "@/components/common/AIMessage";
import { updateTransactionCategoryAction } from "@/lib/actions/classification-actions";
import { formatCurrency } from "@/lib/format";
import type { BudgetCategory, DashboardTransaction } from "@/lib/dashboard-types";

type TransactionDrawerProps = {
  open: boolean;
  transaction: DashboardTransaction | null;
  onClose: () => void;
  onCategoryChange?: (category: BudgetCategory) => void;
};

export default function TransactionDrawer({
  open,
  transaction,
  onClose,
  onCategoryChange,
}: TransactionDrawerProps) {
  const router = useRouter();
  const [category, setCategory] = useState<BudgetCategory | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);

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

  useEffect(() => {
    setCategory(transaction?.category ?? null);
  }, [transaction?.id, transaction?.category]);

  const handleCategoryChange = async (next: BudgetCategory) => {
    if (!transaction || next === category || savingCategory) return;
    const previous = category ?? transaction.category;
    setCategory(next);
    setSavingCategory(true);
    try {
      await updateTransactionCategoryAction(transaction.id, next);
      onCategoryChange?.(next);
      router.refresh();
    } catch {
      setCategory(previous);
    } finally {
      setSavingCategory(false);
    }
  };

  if (!open || !transaction) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[70] flex max-h-[90vh] w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="transaction-detail-title"
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2
            id="transaction-detail-title"
            className="text-[18px] font-semibold tracking-title-tight text-navy"
          >
            거래 상세정보
          </h2>
          <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[28px] font-semibold tracking-title-tight text-navy tabular-nums">
                {formatCurrency(transaction.amount)}
              </p>
              <p className="mt-1 text-[15px] font-medium text-ink">{transaction.merchant}</p>
            </div>
            <StatusBadge status={transaction.status} />
          </div>

          <div className="border-t border-hairline pt-6">
            <CategorySelectField
              label="카테고리"
              value={category ?? transaction.category}
              onChange={handleCategoryChange}
              disabled={savingCategory}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <DetailField label="날짜" value={transaction.dateLabel} />
            <DetailField label="거래 후 잔액" value={formatCurrency(transaction.balance)} />
            <DetailField label="결제수단" value={transaction.paymentMethod ?? "-"} />
            <DetailField label="거래번호" value={transaction.transactionId ?? "-"} />
          </div>

          <div className="mt-6 rounded-2xl bg-surface p-4 ring-1 ring-hairline">
            <AIMessage>
              {category ?? transaction.category}(으)로 분류되어 있어요.
              {transaction.aiConfidence ? ` AI 신뢰도 ${transaction.aiConfidence}%` : ""}
              {savingCategory ? " 저장 중..." : ""}
            </AIMessage>
          </div>
        </div>

        <div className="border-t border-hairline px-6 py-4">
          {transaction.status === "review" ? (
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                onClose();
                router.push("/audit");
              }}
            >
              검토하기
            </Button>
          ) : (
            <Button variant="secondary" className="w-full" onClick={onClose}>
              닫기
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1 text-[15px] font-medium text-ink">{value}</p>
    </div>
  );
}
