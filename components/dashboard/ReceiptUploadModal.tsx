"use client";

import { useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";
import Button from "@/components/common/Button";

type ReceiptUploadModalProps = {
  open: boolean;
  merchant: string;
  onClose: () => void;
  onUpload: () => void;
};

export default function ReceiptUploadModal({
  open,
  merchant,
  onClose,
  onUpload,
}: ReceiptUploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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
        aria-labelledby="receipt-modal-title"
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2
            id="receipt-modal-title"
            className="text-[16px] font-semibold tracking-title-tight text-navy"
          >
            영수증 추가
          </h2>
          <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="mb-4 text-[14px] text-ink2">
            <span className="font-medium text-ink">{merchant}</span> 거래에 영수증을 연결합니다.
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => onUpload()}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-hairline bg-surface py-10 transition-all duration-200 hover:border-brand/30 hover:bg-brand-subtle/30"
          >
            <Upload size={28} className="text-muted" strokeWidth={1.5} />
            <span className="text-[13px] font-medium text-ink2">이미지를 선택하거나 드래그하세요</span>
          </button>
        </div>

        <div className="flex gap-2.5 border-t border-hairline px-6 py-4">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => inputRef.current?.click()}
          >
            업로드
          </Button>
        </div>
      </div>
    </>
  );
}
