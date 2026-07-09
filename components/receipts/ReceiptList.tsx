"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import {
  convertReceiptToPaymentAction,
  updateLinkedTransactionAction,
  updateReceiptAction,
} from "@/lib/actions/receipt-actions";
import { formatCurrency } from "@/lib/format";
import { OPENAI_CLASSIFY_CATEGORIES } from "@/lib/openai-classify";
import type { Receipt } from "@/lib/receipts/receipt-types";
import type { BudgetCategory } from "@/lib/dashboard-types";
import { resolveCategory, type Transaction } from "@/lib/transactions/transaction-types";

type ReceiptListProps = {
  receipts: Receipt[];
  transactions: Transaction[];
};

const inputClass =
  "h-10 w-full rounded-btn border border-hairline bg-card px-3 text-[13px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

function ReceiptRow({
  receipt,
  linkedTransaction,
}: {
  receipt: Receipt;
  linkedTransaction: Transaction | undefined;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [merchant, setMerchant] = useState(receipt.merchant);
  const [date, setDate] = useState(receipt.purchasedAt);
  const [amount, setAmount] = useState(receipt.totalAmount);
  const [txMerchant, setTxMerchant] = useState(linkedTransaction?.merchant ?? "");
  const [txDate, setTxDate] = useState(linkedTransaction?.transactionDate ?? "");
  const [txAmount, setTxAmount] = useState(linkedTransaction?.amount ?? 0);
  const [txCategory, setTxCategory] = useState<BudgetCategory>(
    (resolveCategory(linkedTransaction?.category) as BudgetCategory) ?? "기타"
  );
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const canSave =
    merchant.trim().length > 0 &&
    date.length > 0 &&
    amount > 0 &&
    (!linkedTransaction || (txMerchant.trim().length > 0 && txDate.length > 0 && txAmount > 0));

  const handleConvertToTransaction = async () => {
    setConverting(true);
    setConvertError(null);
    try {
      await convertReceiptToPaymentAction(receipt.id);
      router.refresh();
    } catch (err) {
      setConvertError(err instanceof Error ? err.message : "거래내역 등록에 실패했습니다.");
    } finally {
      setConverting(false);
    }
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setSaveError(null);
    try {
      await updateReceiptAction(receipt.id, {
        merchant: merchant.trim(),
        purchasedAt: date,
        totalAmount: amount,
      });
      if (linkedTransaction) {
        await updateLinkedTransactionAction(linkedTransaction.id, {
          merchant: txMerchant.trim(),
          transactedAt: txDate,
          amount: txAmount,
          category: txCategory,
        });
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <li className="rounded-2xl border border-hairline bg-surface px-4 py-3.5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {receipt.imageDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={receipt.imageDataUrl}
              alt="영수증 썸네일"
              className="h-14 w-14 shrink-0 rounded-lg border border-hairline object-cover"
            />
          )}
          <div className="min-w-0">
            {editing ? (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <input
                  className={inputClass}
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="거래처"
                />
                <input
                  type="date"
                  className={inputClass}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <input
                  type="number"
                  className={inputClass}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                />
              </div>
            ) : (
              <>
                <p className="truncate text-[14px] font-medium text-ink">{receipt.merchant}</p>
                <p className="mt-0.5 text-[12px] text-muted">
                  {receipt.purchasedAt} · {receipt.fileName}
                </p>
              </>
            )}
            {saveError && <p className="mt-1 text-[12px] text-danger">{saveError}</p>}
            {convertError && <p className="mt-1 text-[12px] text-danger">{convertError}</p>}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!editing && (
            <>
              <span className="text-[14px] font-semibold tabular-nums text-navy">
                {formatCurrency(receipt.totalAmount)}
              </span>
              <Badge variant={receipt.linkedTransactionId ? "success" : "warning"} size="sm">
                {receipt.linkedTransactionId ? "연결됨" : "미연결"}
              </Badge>
              {!receipt.linkedTransactionId && (
                <Button
                  variant="secondary"
                  className="!h-9 !px-3 !text-[12px]"
                  onClick={handleConvertToTransaction}
                  disabled={converting}
                >
                  {converting ? "등록 중..." : "거래내역으로 등록"}
                </Button>
              )}
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="ui-icon-btn"
                aria-label="영수증 정보 수정"
              >
                <Pencil size={14} strokeWidth={1.75} />
              </button>
            </>
          )}
          {editing && (
            <>
              <Button
                variant="secondary"
                className="!h-9 !px-3 !text-[12px]"
                onClick={() => {
                  setEditing(false);
                  setMerchant(receipt.merchant);
                  setDate(receipt.purchasedAt);
                  setAmount(receipt.totalAmount);
                  setTxMerchant(linkedTransaction?.merchant ?? "");
                  setTxDate(linkedTransaction?.transactionDate ?? "");
                  setTxAmount(linkedTransaction?.amount ?? 0);
                  setTxCategory((resolveCategory(linkedTransaction?.category) as BudgetCategory) ?? "기타");
                  setSaveError(null);
                }}
                disabled={saving}
              >
                취소
              </Button>
              <Button
                variant="primary"
                className="!h-9 !px-3 !text-[12px]"
                onClick={handleSave}
                disabled={!canSave || saving}
              >
                {saving ? "저장 중..." : "저장"}
              </Button>
            </>
          )}
        </div>
      </div>

      {linkedTransaction && !editing && (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-hairline pt-3 text-[12px] sm:grid-cols-4">
          <div>
            <p className="text-muted">연결된 거래처</p>
            <p className="mt-0.5 font-medium text-ink">{linkedTransaction.merchant}</p>
          </div>
          <div>
            <p className="text-muted">거래일</p>
            <p className="mt-0.5 font-medium text-ink">{linkedTransaction.transactionDate}</p>
          </div>
          <div>
            <p className="text-muted">거래 금액</p>
            <p className="mt-0.5 font-medium text-ink">
              {formatCurrency(linkedTransaction.amount)}
            </p>
          </div>
          <div>
            <p className="text-muted">카테고리</p>
            <p className="mt-0.5 font-medium text-ink">
              {resolveCategory(linkedTransaction.category)}
            </p>
          </div>
        </div>
      )}

      {linkedTransaction && editing && (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-hairline pt-3 text-[12px] sm:grid-cols-4">
          <div>
            <p className="text-muted mb-1">연결된 거래처</p>
            <input
              className={inputClass}
              value={txMerchant}
              onChange={(e) => setTxMerchant(e.target.value)}
              placeholder="거래처"
            />
          </div>
          <div>
            <p className="text-muted mb-1">거래일</p>
            <input
              type="date"
              className={inputClass}
              value={txDate}
              onChange={(e) => setTxDate(e.target.value)}
            />
          </div>
          <div>
            <p className="text-muted mb-1">거래 금액</p>
            <input
              type="number"
              className={inputClass}
              value={txAmount}
              onChange={(e) => setTxAmount(Number(e.target.value) || 0)}
            />
          </div>
          <div>
            <p className="text-muted mb-1">카테고리</p>
            <select
              className={inputClass}
              value={txCategory}
              onChange={(e) => setTxCategory(e.target.value as BudgetCategory)}
            >
              {OPENAI_CLASSIFY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </li>
  );
}

export default function ReceiptList({ receipts, transactions }: ReceiptListProps) {
  const transactionById = new Map(transactions.map((t) => [t.id, t]));

  return (
    <Card>
      <h3 className="dash-card-title mb-5">저장된 영수증</h3>
      {receipts.length === 0 ? (
        <p className="text-[14px] text-ink2">아직 등록된 영수증이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {receipts.map((receipt) => (
            <ReceiptRow
              key={receipt.id}
              receipt={receipt}
              linkedTransaction={
                receipt.linkedTransactionId
                  ? transactionById.get(receipt.linkedTransactionId)
                  : undefined
              }
            />
          ))}
        </ul>
      )}
    </Card>
  );
}
