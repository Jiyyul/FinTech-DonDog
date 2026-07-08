"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import Card from "@/components/common/Card";
import { validateReceiptFile } from "@/lib/receipts/receipt-types";

type ReceiptUploadCardProps = {
  onFileSelected: (file: File) => void;
};

export default function ReceiptUploadCard({ onFileSelected }: ReceiptUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const validationError = validateReceiptFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onFileSelected(file);
  };

  return (
    <Card>
      <h3 className="dash-card-title mb-1">영수증 업로드</h3>
      <p className="mb-5 text-[13px] text-muted">JPG, PNG, WEBP, PDF · 최대 10MB</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-12 transition-all duration-200 ${
          dragActive
            ? "border-brand/50 bg-brand-subtle/40"
            : "border-hairline bg-surface hover:border-brand/30 hover:bg-brand-subtle/30"
        }`}
      >
        <Upload size={28} className="text-muted" strokeWidth={1.5} />
        <span className="text-[13px] font-medium text-ink2">
          파일을 선택하거나 이곳에 드래그하세요
        </span>
      </button>

      {error && <p className="mt-3 text-[12px] text-danger">{error}</p>}
    </Card>
  );
}
