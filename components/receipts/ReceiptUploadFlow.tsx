"use client";

import { useMemo, useState } from "react";
import Button from "@/components/common/Button";
import ReceiptMatchCandidates from "@/components/receipts/ReceiptMatchCandidates";
import ReceiptParsedForm from "@/components/receipts/ReceiptParsedForm";
import ReceiptPreview from "@/components/receipts/ReceiptPreview";
import ReceiptUploadCard from "@/components/receipts/ReceiptUploadCard";
import { saveReceiptAction } from "@/lib/actions/receipt-actions";
import { matchReceiptToTransactions } from "@/lib/receipts/receipt-matching";
import { parseReceipt } from "@/lib/receipts/receipt-parser";
import type { ParsedReceipt } from "@/lib/receipts/receipt-types";
import type { Transaction } from "@/lib/transactions/transaction-types";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

import type { DashboardTransaction } from "@/lib/dashboard-types";

type ReceiptUploadFlowProps = {
  transactions: Transaction[];
  lockedTransactionId?: string | null;
  onSuccess?: (message: string, transaction?: DashboardTransaction | null) => void;
  onError?: (message: string) => void;
};

export default function ReceiptUploadFlow({
  transactions,
  lockedTransactionId = null,
  onSuccess,
  onError,
}: ReceiptUploadFlowProps) {
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
  const [ocrError, setOcrError] = useState<string | null>(null);

  const candidates = useMemo(
    () => (parsed && !lockedTransactionId ? matchReceiptToTransactions(parsed, transactions) : []),
    [parsed, transactions, lockedTransactionId]
  );

  const resetForm = () => {
    setFile(null);
    setParsed(null);
    setSelectedTransactionId(lockedTransactionId);
    setOcrError(null);
  };

  const handleFileSelected = (nextFile: File) => {
    setFile(nextFile);
    setParsed(null);
    setSelectedTransactionId(lockedTransactionId);
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
      onError?.("OCR 인식에 실패했습니다. 직접 입력해 주세요.");
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
      const result = await saveReceiptAction(
        parsed,
        { name: file.name, type: file.type, size: file.size },
        selectedTransactionId,
        imageDataUrl
      );
      const message = lockedTransactionId
        ? "영수증을 저장하고 거래에 연결했습니다."
        : selectedTransactionId
          ? "영수증을 저장하고 거래에 연결했습니다."
          : "영수증을 저장하고 새 거래로 등록했습니다.";
      onSuccess?.(message, result.transaction);
      resetForm();
    } catch {
      onError?.("영수증 저장에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {lockedTransaction && (
        <div className="rounded-2xl border border-brand/20 bg-brand-subtle/30 px-4 py-3 text-[13px] font-medium text-ink">
          <span className="font-semibold text-navy">{lockedTransaction.merchant}</span> 거래에
          영수증을 연결합니다.
        </div>
      )}

      {ocrError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-[13px] font-medium text-danger">
          {ocrError}
        </div>
      )}

      <ReceiptUploadCard onFileSelected={handleFileSelected} />
      {file && <ReceiptPreview file={file} onRemove={resetForm} />}
      {file && !parsed && (
        <Button variant="primary" className="w-full" onClick={handleAnalyze} disabled={analyzing}>
          {analyzing ? "OCR 분석 중..." : "OCR 분석 실행"}
        </Button>
      )}

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
  );
}
