"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import ReceiptList from "@/components/receipts/ReceiptList";
import ReceiptMatchCandidates from "@/components/receipts/ReceiptMatchCandidates";
import ReceiptParsedForm from "@/components/receipts/ReceiptParsedForm";
import ReceiptPreview from "@/components/receipts/ReceiptPreview";
import ReceiptUploadCard from "@/components/receipts/ReceiptUploadCard";
import { saveReceiptAction } from "@/lib/actions/receipt-actions";
import { matchReceiptToTransactions } from "@/lib/receipts/receipt-matching";
import { parseReceipt } from "@/lib/receipts/receipt-parser";
import type { ParsedReceipt, Receipt } from "@/lib/receipts/receipt-types";
import type { Transaction } from "@/lib/transactions/transaction-types";

type ReceiptsPageProps = {
  initialTransactions: Transaction[];
  initialReceipts: Receipt[];
  initialTransactionId: string | null;
};

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function ReceiptsPage({
  initialTransactions,
  initialReceipts,
  initialTransactionId,
}: ReceiptsPageProps) {
  const router = useRouter();
  const transactions = initialTransactions;
  const [receipts, setReceipts] = useState(initialReceipts);
  const lockedTransactionId = initialTransactionId;
  const lockedTransaction = lockedTransactionId
    ? transactions.find((t) => t.id === lockedTransactionId) ?? null
    : null;

  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedReceipt | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(
    lockedTransactionId
  );
  const [message, setMessage] = useState<string | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const unreceiptedCount = useMemo(
    () => transactions.filter((t) => !t.hasReceipt).length,
    [transactions]
  );

  // parsed 값을 사용자가 직접 수정할 때마다 매칭 후보도 함께 다시 계산한다.
  // 특정 거래에서 넘어온 경우(lockedTransactionId)는 후보 매칭을 생략하고 그 거래로 고정한다.
  const candidates = useMemo(
    () => (parsed && !lockedTransactionId ? matchReceiptToTransactions(parsed, transactions) : []),
    [parsed, transactions, lockedTransactionId]
  );

  const resetForm = () => {
    setFile(null);
    setParsed(null);
    setSelectedTransactionId(lockedTransactionId);
  };

  const handleFileSelected = (nextFile: File) => {
    setFile(nextFile);
    setParsed(null);
    setSelectedTransactionId(lockedTransactionId);
    setMessage(null);
    setOcrError(null);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setOcrError(null);
    try {
      const result = await parseReceipt(file);
      setParsed(result);
    } catch {
      setOcrError("OCR 인식에 실패했습니다. 직접 입력해 주세요.");
      setParsed({
        merchant: "",
        purchasedAt: "",
        purchasedTime: null,
        totalAmount: 0,
        paymentMethod: null,
        category: undefined,
        rawText: "",
        confidence: 0,
        items: [],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!file || !parsed) return;
    setSaving(true);
    try {
      const imageDataUrl = file.type.startsWith("image/")
        ? await fileToDataUrl(file).catch(() => null)
        : null;
      const receipt = await saveReceiptAction(
        parsed,
        { name: file.name, type: file.type, size: file.size },
        selectedTransactionId,
        imageDataUrl
      );
      setReceipts((prev) => [receipt, ...prev]);
      if (lockedTransactionId) {
        router.push("/");
        router.refresh();
        return;
      }
      setMessage(
        selectedTransactionId
          ? "영수증을 저장하고 거래에 연결했습니다."
          : "영수증을 저장하고 새 거래로 등록했습니다."
      );
      resetForm();
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

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

      {ocrError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-[13px] font-medium text-danger">
          {ocrError}
        </div>
      )}

      {lockedTransaction && (
        <div className="rounded-2xl border border-brand/20 bg-brand-subtle/30 px-4 py-3 text-[13px] font-medium text-ink">
          <span className="font-semibold text-navy">{lockedTransaction.merchant}</span> 거래에
          영수증을 연결합니다.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="space-y-6">
          <ReceiptUploadCard onFileSelected={handleFileSelected} />
          {file && <ReceiptPreview file={file} onRemove={resetForm} />}
          {file && !parsed && (
            <Button
              variant="primary"
              className="w-full"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              {analyzing ? "OCR 분석 중..." : "OCR 분석 실행"}
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {parsed && (
            <>
              <ReceiptParsedForm parsed={parsed} onChange={setParsed} />
              {!lockedTransactionId && (
                <ReceiptMatchCandidates
                  candidates={candidates}
                  transactions={transactions}
                  selectedTransactionId={selectedTransactionId}
                  onSelect={(id) => setSelectedTransactionId((prev) => (prev === id ? null : id))}
                />
              )}
              <Button variant="primary" className="w-full" onClick={handleSave} disabled={saving}>
                {saving
                  ? "저장 중..."
                  : lockedTransactionId
                    ? "영수증 저장 및 거래 연결"
                    : selectedTransactionId
                      ? "영수증 저장 및 거래 연결"
                      : "영수증 저장 (새 거래로 등록)"}
              </Button>
            </>
          )}
        </div>
      </div>

      <ReceiptList receipts={receipts} transactions={transactions} />
    </div>
  );
}
