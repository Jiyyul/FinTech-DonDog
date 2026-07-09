"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import Button from "@/components/common/Button";
import type { BudgetCategory } from "@/lib/dashboard-types";
import type { ManualTransactionInput } from "@/lib/transaction-utils";

const CATEGORIES: BudgetCategory[] = [
  "행사비",
  "식비",
  "운영비",
  "교통비",
  "장비비",
  "홍보비",
  "기타",
];

const PAYMENT_METHODS = ["학생회 체크카드", "계좌이체", "현금", "기타"];

const inputClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

type AddTransactionModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: ManualTransactionInput) => void;
};

function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function AddTransactionModal({
  open,
  onClose,
  onSubmit,
}: AddTransactionModalProps) {
  const receiptRef = useRef<HTMLInputElement>(null);
  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIsoDate);
  const [category, setCategory] = useState<BudgetCategory>("식비");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptFileName, setReceiptFileName] = useState<string | null>(null);
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    if (open) {
      setMerchant("");
      setAmount("");
      setDate(todayIsoDate());
      setCategory("식비");
      setPaymentMethod(PAYMENT_METHODS[0]);
      setReceiptFile(null);
      setReceiptFileName(null);
      setAmountError("");
    }
  }, [open]);

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

  const hasAttachment = Boolean(receiptFile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !receiptFile) return;

    const parsedAmount = Number(amount.replace(/,/g, ""));
    if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setAmountError("올바른 금액을 입력해 주세요.");
      return;
    }

    onSubmit({
      merchant: merchant.trim(),
      amount: parsedAmount,
      date,
      category,
      paymentMethod,
      receiptFile,
    });
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[90] flex max-h-[90vh] w-[min(460px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="add-transaction-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-hairline px-6 py-5">
          <h2
            id="add-transaction-title"
            className="text-[16px] font-semibold tracking-title-tight text-navy"
          >
            거래내역 추가
          </h2>
          <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <p className="mb-5 text-[13px] leading-relaxed text-ink2">
            계좌·카드 연동 전이거나 누락된 거래를 직접 등록할 수 있습니다.
          </p>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">거래처</span>
              <input
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className={inputClass}
                placeholder="예: 김밥천국"
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">금액</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setAmountError("");
                }}
                className={inputClass}
                placeholder="예: 42000"
                min={1}
                required
              />
              {amountError && (
                <p className="mt-1.5 text-[12px] text-danger">{amountError}</p>
              )}
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">날짜</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
                required
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">카테고리</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as BudgetCategory)}
                className={inputClass}
              >
                {CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[13px] text-muted">결제수단</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={inputClass}
              >
                {PAYMENT_METHODS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-1.5 block text-[13px] text-muted">
                영수증 / 카드매출전표 <span className="text-danger">*</span>
              </span>
              <input
                ref={receiptRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setReceiptFile(file ?? null);
                  setReceiptFileName(file?.name ?? null);
                }}
              />
              <button
                type="button"
                onClick={() => receiptRef.current?.click()}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-6 transition-colors ${
                  hasAttachment
                    ? "border-brand/30 bg-brand-subtle/20"
                    : "border-hairline bg-surface hover:border-brand/30 hover:bg-brand-subtle/20"
                }`}
              >
                <Upload size={18} className="text-muted" strokeWidth={1.5} />
                <span className="text-[13px] text-ink2">
                  {receiptFileName ?? "영수증 또는 카드매출전표 첨부"}
                </span>
              </button>
              {!hasAttachment && (
                <p className="mt-1.5 text-[12px] text-muted">
                  등록하려면 영수증 또는 카드매출전표를 첨부해 주세요.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-2.5">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={!hasAttachment}>
              등록하기
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
