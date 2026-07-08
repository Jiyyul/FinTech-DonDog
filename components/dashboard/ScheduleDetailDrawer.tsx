"use client";

import { useEffect } from "react";
import { X, Pencil } from "lucide-react";
import Button from "@/components/common/Button";
import type { CalendarEvent } from "@/lib/dashboard-types";

type ScheduleDetailDrawerProps = {
  open: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit: () => void;
};

export default function ScheduleDetailDrawer({
  open,
  event,
  onClose,
  onEdit,
}: ScheduleDetailDrawerProps) {
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
        className={`fixed right-0 top-0 z-[70] flex h-screen w-full max-w-[400px] flex-col border-l border-hairline bg-card shadow-[-4px_0_32px_rgba(16,24,40,0.06)] transition-transform duration-300 ease-premium ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal
        aria-label="일정 상세"
      >
        {event && (
          <>
            <div className="flex items-center justify-between border-b border-hairline px-7 py-5">
              <h2 className="text-[16px] font-semibold tracking-title-tight text-navy">
                일정 상세
              </h2>
              <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6">
              <span
                className="inline-block rounded-full px-3 py-1 text-[12px] font-medium"
                style={{
                  backgroundColor: `${event.color}15`,
                  color: event.color,
                }}
              >
                {event.month}월 {event.date}일
              </span>
              <h3 className="mt-4 text-[22px] font-semibold tracking-title-tight text-navy">
                {event.title}
              </h3>
              {event.description && (
                <p className="mt-4 text-[15px] leading-relaxed text-ink2">{event.description}</p>
              )}
            </div>

            <div className="border-t border-hairline px-7 py-4">
              <Button
                variant="secondary"
                className="w-full"
                icon={<Pencil size={15} strokeWidth={1.5} />}
                onClick={onEdit}
              >
                수정하기
              </Button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
