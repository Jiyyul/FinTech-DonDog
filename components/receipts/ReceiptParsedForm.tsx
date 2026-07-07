"use client";

import { Trash2 } from "lucide-react";
import AIMessage from "@/components/common/AIMessage";
import Card from "@/components/common/Card";
import type { ParsedReceipt, ReceiptItem } from "@/lib/receipts/receipt-types";
import { resolveCategory } from "@/lib/transactions/transaction-types";

const CATEGORY_OPTIONS = ["행사비", "식비", "운영비", "교통비", "장비비", "홍보비", "기타"];

const inputClass =
  "h-11 w-full rounded-btn border border-hairline bg-card px-3.5 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

type ReceiptParsedFormProps = {
  parsed: ParsedReceipt;
  onChange: (next: ParsedReceipt) => void;
};

export default function ReceiptParsedForm({ parsed, onChange }: ReceiptParsedFormProps) {
  const update = <K extends keyof ParsedReceipt>(key: K, value: ParsedReceipt[K]) => {
    onChange({ ...parsed, [key]: value });
  };

  const updateItem = (id: string, patch: Partial<ReceiptItem>) => {
    update(
      "items",
      parsed.items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeItem = (id: string) => {
    update(
      "items",
      parsed.items.filter((item) => item.id !== id)
    );
  };

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="dash-card-title">추출 결과 확인 및 수정</h3>
        <span className="text-[12px] font-medium text-muted">신뢰도 {parsed.confidence}%</span>
      </div>

      <AIMessage className="mb-5">
        OCR로 영수증을 읽었어요. 잘못된 값이 있으면 직접 수정해 주세요.
      </AIMessage>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-muted">가맹점명</span>
          <input
            className={inputClass}
            value={parsed.merchant}
            onChange={(e) => update("merchant", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-muted">결제일</span>
          <input
            type="date"
            className={inputClass}
            value={parsed.purchasedAt}
            onChange={(e) => update("purchasedAt", e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-muted">결제시간</span>
          <input
            type="time"
            className={inputClass}
            value={parsed.purchasedTime ?? ""}
            onChange={(e) => update("purchasedTime", e.target.value || null)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-muted">금액</span>
          <input
            type="number"
            className={inputClass}
            value={parsed.totalAmount}
            onChange={(e) => update("totalAmount", Number(e.target.value) || 0)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-muted">결제수단</span>
          <input
            className={inputClass}
            value={parsed.paymentMethod ?? ""}
            onChange={(e) => update("paymentMethod", e.target.value || null)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] text-muted">카테고리</span>
          <select
            className={inputClass}
            value={resolveCategory(parsed.category)}
            onChange={(e) => update("category", e.target.value)}
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 border-t border-hairline pt-5">
        <p className="mb-3 text-[13px] font-semibold text-ink">품목</p>
        <div className="space-y-2">
          {parsed.items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <input
                className={`${inputClass} flex-[2]`}
                value={item.name}
                onChange={(e) => updateItem(item.id, { name: e.target.value })}
              />
              <input
                type="number"
                className={`${inputClass} flex-1`}
                value={item.quantity ?? 0}
                onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 0 })}
              />
              <input
                type="number"
                className={`${inputClass} flex-1`}
                value={item.amount ?? 0}
                onChange={(e) => updateItem(item.id, { amount: Number(e.target.value) || 0 })}
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="ui-icon-btn h-9 w-9 shrink-0"
                aria-label="품목 삭제"
              >
                <Trash2 size={14} strokeWidth={1.75} />
              </button>
            </div>
          ))}
          {parsed.items.length === 0 && (
            <p className="text-[13px] text-muted">인식된 품목이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-hairline pt-5">
        <p className="mb-2 text-[13px] font-semibold text-ink">OCR 원문</p>
        <pre className="whitespace-pre-wrap rounded-xl bg-surface p-3 text-[12px] leading-relaxed text-ink2">
          {parsed.rawText}
        </pre>
      </div>
    </Card>
  );
}
