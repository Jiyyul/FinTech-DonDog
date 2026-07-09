"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ReceiptList from "@/components/receipts/ReceiptList";
import ReceiptUploadFlow from "@/components/receipts/ReceiptUploadFlow";
import type { Receipt } from "@/lib/receipts/receipt-types";
import type { Transaction } from "@/lib/transactions/transaction-types";

type ReceiptsPageProps = {
  initialTransactions: Transaction[];
  initialReceipts: Receipt[];
  initialTransactionId: string | null;
};

export default function ReceiptsPage({
  initialTransactions,
  initialReceipts,
  initialTransactionId,
}: ReceiptsPageProps) {
  const router = useRouter();
  const transactions = initialTransactions;
  const [receipts, setReceipts] = useState(initialReceipts);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setReceipts(initialReceipts);
  }, [initialReceipts]);

  const unreceiptedCount = useMemo(
    () => transactions.filter((t) => !t.hasReceipt).length,
    [transactions]
  );

  return (
    <div className="space-y-8 pb-10">
      <div>
        <p className="dash-section-label normal-case tracking-normal">영수증 관리</p>
        <h1 className="ui-page-title mt-1">영수증 업로드 및 거래 확인</h1>
        <p className="ui-page-subtitle">
          영수증을 업로드하고 OCR로 추출한 값을 확인한 뒤 거래와 연결하세요. 영수증이 없는
          거래가 {unreceiptedCount}건 있습니다.
        </p>
      </div>

      {message && (
        <div className="rounded-2xl border border-success/20 bg-success/10 px-4 py-3 text-[13px] font-medium text-success">
          {message}
        </div>
      )}

      <ReceiptUploadFlow
        transactions={transactions}
        lockedTransactionId={initialTransactionId}
        onSuccess={(successMessage) => {
          setMessage(successMessage);
          if (initialTransactionId) {
            router.push("/");
            router.refresh();
            return;
          }
          router.refresh();
        }}
      />

      <ReceiptList receipts={receipts} transactions={transactions} />
    </div>
  );
}
