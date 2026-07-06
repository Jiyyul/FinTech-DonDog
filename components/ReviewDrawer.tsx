"use client";

import { X } from "lucide-react";

export default function ReviewDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/35 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed right-0 top-0 z-50 flex h-screen w-96 flex-col bg-card p-6 shadow-[-12px_0_32px_rgba(16,24,40,0.12)] transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-base font-semibold">거래 검토</h3>
          <button onClick={onClose}>
            <X size={18} className="text-muted" />
          </button>
        </div>

        <Row label="거래처" value="김밥천국" />
        <Row label="금액" value="₩58,000" />
        <Row label="AI 자동 분류" value="식비 · 확신도 62%" />

        <div className="flex flex-col gap-1.5 border-b border-hairline py-3">
          <label className="text-[11px] font-semibold text-muted">분류 변경</label>
          <select className="rounded-[10px] border border-hairline px-2.5 py-2 text-[13px]">
            <option>식비</option>
            <option>행사비</option>
            <option>운영비</option>
            <option>홍보비</option>
            <option>교통비</option>
            <option>기타</option>
          </select>
        </div>

        <div className="mt-auto flex flex-col gap-2.5">
          <button
            onClick={onClose}
            className="w-full rounded-btn border border-hairline bg-card py-2.5 text-[13px] font-semibold hover:bg-appbg"
          >
            공동 승인 요청
          </button>
          <button
            onClick={onClose}
            className="w-full rounded-btn bg-brand py-2.5 text-[13px] font-semibold text-ink hover:brightness-95"
          >
            문제없음 승인
          </button>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-hairline py-3">
      <label className="text-[11px] font-semibold text-muted">{label}</label>
      <strong className="text-sm">{value}</strong>
    </div>
  );
}
