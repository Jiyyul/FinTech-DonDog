"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Paperclip, X } from "lucide-react";
import AnomalyReasonBadge from "@/components/anomalies/AnomalyReasonBadge";
import Button from "@/components/common/Button";
import { formatCurrency } from "@/lib/format";
import type { TransactionAnomalyGroup } from "@/lib/anomalies/anomaly-types";
import { resolveCategory, type Transaction } from "@/lib/transactions/transaction-types";

type AnomalyDetailDrawerProps = {
  open: boolean;
  transaction: Transaction | null;
  group?: TransactionAnomalyGroup;
  onClose: () => void;
};

export default function AnomalyDetailDrawer({
  open,
  transaction,
  group,
  onClose,
}: AnomalyDetailDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/25 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden
      />
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-screen w-full max-w-[420px] flex-col border-l border-hairline bg-card shadow-[-4px_0_32px_rgba(16,24,40,0.06)] transition-transform duration-300 ease-premium ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal
        aria-label="이상거래 상세정보"
      >
        {transaction && (
          <>
            <div className="flex items-center justify-between border-b border-hairline px-7 py-5">
              <h2 className="text-[16px] font-semibold tracking-title-tight text-navy">
                이상거래 상세정보
              </h2>
              <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6">
              <div className="mb-6">
                <p className="text-[28px] font-semibold tracking-title-tight text-navy tabular-nums">
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="mt-1 text-[15px] font-medium text-ink">{transaction.merchant}</p>
                <div className="mt-3">
                  <AnomalyReasonBadge status={group?.primaryType ?? "NORMAL"} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-hairline pt-6">
                <Field label="날짜" value={transaction.transactionDate} />
                <Field label="카테고리" value={resolveCategory(transaction.category)} />
                <Field label="영수증" value={transaction.hasReceipt ? "등록됨" : "미등록"} />
                <Field label="메모" value={transaction.memo ?? "-"} />
              </div>

              {group && group.results.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {group.results.map((result, index) => (
                    <div
                      key={`${result.type}-${index}`}
                      className="rounded-2xl border border-warning/20 bg-warning/5 p-4"
                    >
                      <p className="text-[13px] font-semibold text-ink">{result.title}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">
                        {result.description}
                      </p>
                      <ul className="mt-2 space-y-1">
                        {result.reasons.map((reason, i) => (
                          <li key={i} className="text-[12px] text-muted">
                            · {reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dash-inner-surface mt-6">
                  <p className="text-[14px] text-ink2">감지된 이상거래가 없습니다.</p>
                </div>
              )}
            </div>

            <div className="border-t border-hairline px-7 py-4">
              {!transaction.hasReceipt ? (
                <Link href="/receipts" className="block">
                  <Button
                    variant="primary"
                    className="w-full"
                    icon={<Paperclip size={16} strokeWidth={1.75} />}
                  >
                    영수증 업로드하기
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" className="w-full" onClick={onClose}>
                  닫기
                </Button>
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1 text-[15px] font-medium text-ink">{value}</p>
    </div>
  );
}
