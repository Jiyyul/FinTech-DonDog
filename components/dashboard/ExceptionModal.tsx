"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import type { CalendarEvent } from "@/lib/dashboard-types";

type ExceptionModalProps = {
  open: boolean;
  schedules: CalendarEvent[];
  onClose: () => void;
  onLinkSchedule: (scheduleId: string) => void;
  onDefer: () => void;
};

export default function ExceptionModal({
  open,
  schedules,
  onClose,
  onLinkSchedule,
  onDefer,
}: ExceptionModalProps) {
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
        className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[90] flex max-h-[90vh] w-[min(480px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="exception-modal-title"
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2
            id="exception-modal-title"
            className="text-[16px] font-semibold tracking-title-tight text-navy"
          >
            예외 처리
          </h2>
          <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="mb-4 text-[14px] text-ink2">
            다른 일정에 연결하거나 보류함으로 이동할 수 있습니다.
          </p>
          <p className="dash-section-label mb-3 normal-case tracking-normal">
            등록된 일정
          </p>
          <ul className="space-y-2">
            {schedules.map((schedule) => (
              <li key={schedule.id}>
                <button
                  type="button"
                  onClick={() => onLinkSchedule(schedule.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-hairline bg-surface px-4 py-3 text-left transition-all duration-200 hover:scale-[1.01] hover:ring-1 hover:ring-hairline"
                >
                  <span className="text-[14px] font-medium text-ink">{schedule.title}</span>
                  <span className="text-[12px] text-muted">
                    {schedule.month}월 {schedule.date}일
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2.5 border-t border-hairline px-6 py-4">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button variant="ghost" className="flex-1" onClick={onDefer}>
            보류
          </Button>
        </div>
      </div>
    </>
  );
}
