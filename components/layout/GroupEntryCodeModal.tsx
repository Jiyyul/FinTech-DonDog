"use client";

import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import Button from "@/components/common/Button";

type GroupEntryCodeModalProps = {
  open: boolean;
  groupName: string;
  entryCode: string;
  onClose: () => void;
};

export default function GroupEntryCodeModal({
  open,
  groupName,
  entryCode,
  onClose,
}: GroupEntryCodeModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setCopied(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(entryCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[90] w-[min(440px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="entry-code-title"
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2
            id="entry-code-title"
            className="text-[18px] font-semibold tracking-title-tight text-navy"
          >
            모임이 생성되었습니다
          </h2>
          <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="space-y-5 px-6 py-6">
          <p className="text-[14px] leading-relaxed text-ink2">
            <span className="font-semibold text-ink">{groupName}</span> 모임이 새로 만들어졌습니다.
            아래 입장 코드를 부원에게 공유하면 해당 모임 대시보드에 참여할 수 있습니다.
          </p>

          <div className="rounded-xl bg-surface p-4 ring-1 ring-hairline">
            <p className="mb-2 text-[12px] font-medium text-muted">입장 코드 (10자리)</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 truncate rounded-lg bg-card px-4 py-3 text-[18px] font-bold tracking-widest text-navy">
                {entryCode}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="ui-icon-btn h-11 w-11 shrink-0 border border-hairline bg-card"
                aria-label="입장 코드 복사"
              >
                {copied ? (
                  <Check size={18} className="text-success" strokeWidth={1.75} />
                ) : (
                  <Copy size={18} strokeWidth={1.75} />
                )}
              </button>
            </div>
          </div>

          <p className="text-[12px] text-muted">
            각 모임은 별도의 입장 코드와 대시보드를 가집니다. 상단에서 모임을 전환할 수 있습니다.
          </p>
        </div>

        <div className="border-t border-hairline px-6 py-4">
          <Button type="button" variant="primary" className="w-full" onClick={onClose}>
            대시보드로 이동
          </Button>
        </div>
      </div>
    </>
  );
}
