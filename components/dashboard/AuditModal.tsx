"use client";

import { useEffect } from "react";
import { X, Check, AlertTriangle } from "lucide-react";
import Button from "@/components/common/Button";
import AIMessage from "@/components/common/AIMessage";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { formatCurrency } from "@/lib/format";

type AuditModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AuditModal({ open, onClose }: AuditModalProps) {
  const { pendingAuditTransaction } = useDashboardData();
  const tx = pendingAuditTransaction;

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
        className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[70] flex max-h-[90vh] w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="audit-modal-title"
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5 min-[1280px]:px-8">
          <h2
            id="audit-modal-title"
            className="text-[18px] font-semibold tracking-title-tight text-navy"
          >
            AI 거래 검토
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="ui-icon-btn"
            aria-label="닫기"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 min-[1280px]:px-8">
          <section className="mb-6">
            <h3 className="mb-4 text-[15px] font-semibold text-navy">거래 정보</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoField label="거래처" value={tx.merchant} />
              <InfoField label="금액" value={formatCurrency(tx.amount)} />
              <InfoField label="거래일" value="2026.07.02" />
              <InfoField label="결제수단" value={tx.paymentMethod ?? "-"} />
            </div>
            <p className="mt-3 text-[13px] text-muted">
              거래번호 {tx.transactionId}
            </p>
          </section>

          <div className="my-6 h-px bg-hairline" />

          <section className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-subtle text-[11px]"
                aria-hidden
              >
                🐶
              </span>
              <h3 className="text-[15px] font-semibold text-navy">
                Don Dog AI Analysis
              </h3>
            </div>
            <div className="rounded-2xl bg-surface p-5 ring-1 ring-hairline">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] text-muted">AI 분류</p>
                  <p className="mt-1 text-lg font-semibold text-ink">
                    {tx.category}
                  </p>
                </div>
                <span className="rounded-full bg-accent-subtle px-3 py-1 text-sm font-semibold text-accent">
                  97%
                </span>
              </div>
              <p className="mt-4 text-[13px] text-ink2">
                예상 사용 목적: 학생회 MT 숙박비
              </p>
              <AIMessage className="mt-3">
                가맹점 이름, 거래 금액, 기존 거래 패턴을 종합 분석했습니다.
              </AIMessage>
            </div>
          </section>

          <section className="mb-6">
            <div className="mb-3 flex items-center gap-2">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-subtle text-[11px]"
                aria-hidden
              >
                🐶
              </span>
              <h3 className="text-[15px] font-semibold text-navy">회칙 분석 결과</h3>
            </div>
            <div className="rounded-2xl border border-warning/20 bg-warning/5 p-5">
              <p className="text-[15px] leading-relaxed text-ink2">
                현재 거래는 학생회 회칙 제3조 — 10만원 이상 결제는 공동 승인이
                필요합니다.
              </p>
              <p className="mt-3 font-semibold text-ink">
                현재 금액 {formatCurrency(tx.amount)} → 공동 승인 대상입니다.
              </p>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-[15px] font-semibold text-navy">
              이상 거래 검사
            </h3>
            <ul className="space-y-2">
              <CheckItem label="중복 결제 없음" />
              <CheckItem label="예산 범위 내" />
              <CheckItem label="과거 거래와 유사" />
              <li className="flex items-center gap-2 text-[13px] text-warning">
                <AlertTriangle size={16} strokeWidth={1.75} />
                공동 승인 필요
              </li>
            </ul>
          </section>
        </div>

        <div className="flex flex-wrap gap-2.5 border-t border-hairline px-6 py-4 min-[1280px]:px-8">
          <Button variant="primary" className="min-w-[8rem] flex-1" onClick={onClose}>
            공동 승인 요청
          </Button>
          <Button variant="secondary" className="min-w-[8rem] flex-1" onClick={onClose}>
            문제없음 승인
          </Button>
          <Button variant="ghost" className="min-w-[4rem] px-4 text-[13px]" onClick={onClose}>
            보류
          </Button>
        </div>
      </div>
    </>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] text-muted">{label}</p>
      <p className="mt-1 text-[15px] font-semibold text-ink">{value}</p>
    </div>
  );
}

function CheckItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-2 text-[13px] text-ink2">
      <Check size={16} className="text-success" strokeWidth={2} />
      {label}
    </li>
  );
}
