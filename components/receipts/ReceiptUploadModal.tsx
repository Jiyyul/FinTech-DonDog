"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import ReceiptUploadFlow from "@/components/receipts/ReceiptUploadFlow";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import type { Transaction } from "@/lib/transactions/transaction-types";

type ReceiptUploadModalProps = {
  open: boolean;
  onClose: () => void;
  transactions: Transaction[];
  lockedTransactionId?: string | null;
  title?: string;
};

export default function ReceiptUploadModal({
  open,
  onClose,
  transactions,
  lockedTransactionId = null,
  title = "영수증 업로드",
}: ReceiptUploadModalProps) {
  const router = useRouter();
  const { prependTransaction } = useDashboardData();
  const [message, setMessage] = useState<string | null>(null);
  const [flowKey, setFlowKey] = useState(0);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setMessage(null);
      setFlowKey((k) => k + 1);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleClose = () => {
    setMessage(null);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[90] flex max-h-[90vh] w-[min(640px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="receipt-upload-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-hairline px-6 py-5">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-label-wide text-muted">
              영수증 관리
            </p>
            <h2
              id="receipt-upload-title"
              className="mt-0.5 text-[18px] font-semibold tracking-title-tight text-navy"
            >
              {title}
            </h2>
          </div>
          <button type="button" onClick={handleClose} className="ui-icon-btn" aria-label="닫기">
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {message && (
            <div className="mb-5 rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-[13px] font-medium text-success">
              {message}
            </div>
          )}

          <ReceiptUploadFlow
            key={flowKey}
            transactions={transactions}
            lockedTransactionId={lockedTransactionId}
            onSuccess={(successMessage, transaction) => {
              setMessage(successMessage);
              if (transaction) prependTransaction(transaction);
              router.refresh();
              if (lockedTransactionId) {
                setTimeout(() => handleClose(), 800);
              }
            }}
          />
        </div>
      </div>
    </>
  );
}
