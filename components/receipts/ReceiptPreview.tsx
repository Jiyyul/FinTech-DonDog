"use client";

import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";

type ReceiptPreviewProps = {
  file: File;
  onRemove: () => void;
};

export default function ReceiptPreview({ file, onRemove }: ReceiptPreviewProps) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const isPdf = file.type === "application/pdf";
  const sizeLabel = `${(file.size / 1024).toFixed(0)}KB`;

  return (
    <div className="rounded-2xl border border-hairline bg-surface p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <FileText size={16} className="shrink-0 text-muted" strokeWidth={1.75} />
          <p className="truncate text-[13px] font-medium text-ink">{file.name}</p>
          <span className="shrink-0 text-[12px] text-muted">{sizeLabel}</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="ui-icon-btn h-8 w-8 shrink-0"
          aria-label="파일 제거"
        >
          <X size={15} strokeWidth={1.5} />
        </button>
      </div>

      {url &&
        (isPdf ? (
          <object
            data={url}
            type="application/pdf"
            className="h-64 w-full rounded-xl border border-hairline"
          >
            <a href={url} target="_blank" rel="noreferrer" className="text-[13px] text-brand">
              새 탭에서 PDF 열기
            </a>
          </object>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="영수증 미리보기"
            className="max-h-64 w-full rounded-xl border border-hairline object-contain"
          />
        ))}
    </div>
  );
}
