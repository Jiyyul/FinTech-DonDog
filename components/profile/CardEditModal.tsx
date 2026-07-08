"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import type { RegisteredCard } from "@/lib/mock-data";

type CardEditModalProps = {
  open: boolean;
  card: RegisteredCard | null;
  onClose: () => void;
  onSave: (card: RegisteredCard) => void;
};

const inputClass =
  "h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]";

export default function CardEditModal({
  open,
  card,
  onClose,
  onSave,
}: CardEditModalProps) {
  const isNew = !card;
  const [label, setLabel] = useState("");
  const [issuer, setIssuer] = useState("");
  const [last4, setLast4] = useState("");

  useEffect(() => {
    if (open) {
      setLabel(card?.label ?? "");
      setIssuer(card?.issuer ?? "");
      setLast4(card?.last4 ?? "");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, card]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: card?.id ?? `card-${Date.now()}`,
      label: label.trim(),
      issuer: issuer.trim(),
      last4: last4.trim(),
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
        className="fixed left-1/2 top-1/2 z-[90] w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="card-edit-title"
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2
            id="card-edit-title"
            className="text-[16px] font-semibold tracking-title-tight text-navy"
          >
            {isNew ? "카드 등록" : "카드 정보 수정"}
          </h2>
          <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-muted">카드 별칭</span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className={inputClass}
              placeholder="예: 학생회 체크카드"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-muted">발급 은행</span>
            <input
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              className={inputClass}
              placeholder="예: 국민은행"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-muted">카드 번호 (끝 4자리)</span>
            <input
              value={last4}
              onChange={(e) => setLast4(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className={inputClass}
              placeholder="1234"
              maxLength={4}
              inputMode="numeric"
              required
            />
          </label>
          <div className="flex gap-2.5 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              {isNew ? "등록" : "저장"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
