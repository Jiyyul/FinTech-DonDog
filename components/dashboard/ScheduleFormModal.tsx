"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/common/Button";
import type { CalendarEvent } from "@/lib/dashboard-types";
import { CATEGORY_COLORS } from "@/lib/chart-colors";

function formatDateText(year: number, month: number, date: number) {
  return `${year}.${String(month).padStart(2, "0")}.${String(date).padStart(2, "0")}`;
}

function parseDateText(
  value: string
): { year: number; month: number; date: number } | null {
  const match = value.trim().match(/^(\d{4})\.(\d{1,2})\.(\d{1,2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const date = Number(match[3]);

  if (month < 1 || month > 12 || date < 1 || date > 31) return null;

  const daysInMonth = new Date(year, month, 0).getDate();
  if (date > daysInMonth) return null;

  return { year, month, date };
}

type ScheduleFormModalProps = {
  open: boolean;
  initial?: CalendarEvent | null;
  year: number;
  month: number;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id"> & { id?: string }) => void;
  onDelete?: (id: string) => void;
};

export default function ScheduleFormModal({
  open,
  initial,
  year,
  month,
  onClose,
  onSave,
  onDelete,
}: ScheduleFormModalProps) {
  const [title, setTitle] = useState("");
  const [dateText, setDateText] = useState("");
  const [dateError, setDateError] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(initial?.title ?? "");
      setDateText(
        initial
          ? formatDateText(initial.year, initial.month, initial.date)
          : formatDateText(year, month, 1)
      );
      setDateError("");
      setDescription(initial?.description ?? "");
    }
  }, [open, initial, year, month]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsed = parseDateText(dateText);
    if (!parsed) {
      setDateError("날짜 형식: YYYY.MM.DD (예: 2026.07.12)");
      return;
    }

    onSave({
      id: initial?.id,
      title: title.trim(),
      date: parsed.date,
      month: parsed.month,
      year: parsed.year,
      color: initial?.color ?? CATEGORY_COLORS.행사비,
      description: description.trim() || undefined,
    });
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-[90] w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover animate-chat-open"
        role="dialog"
        aria-modal
        aria-labelledby="schedule-form-title"
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2
            id="schedule-form-title"
            className="text-[16px] font-semibold tracking-title-tight text-navy"
          >
            {initial ? "일정 수정" : "일정 등록"}
          </h2>
          <button type="button" onClick={onClose} className="ui-icon-btn" aria-label="닫기">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-muted">일정명</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]"
              placeholder="예: 학생회 MT"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-muted">날짜</span>
            <input
              type="text"
              inputMode="numeric"
              value={dateText}
              onChange={(e) => {
                setDateText(e.target.value);
                setDateError("");
              }}
              className="h-12 w-full rounded-btn border border-hairline bg-card px-4 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]"
              placeholder="2026.07.12"
              required
            />
            {dateError ? (
              <p className="mt-1.5 text-[12px] text-danger">{dateError}</p>
            ) : (
              <p className="mt-1.5 text-[12px] text-muted">형식: 연.월.일 (예: 2026.07.12)</p>
            )}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] text-muted">메모</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-btn border border-hairline bg-card px-4 py-3 text-[14px] outline-none transition-colors focus:border-brand focus:shadow-[0_0_0_3px_rgba(10,22,128,0.12)]"
              placeholder="일정 설명 (선택)"
            />
          </label>

          <div className="flex gap-2.5 pt-2">
            {initial && onDelete && (
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                onClick={() => {
                  onDelete(initial.id);
                  onClose();
                }}
              >
                삭제
              </Button>
            )}
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              취소
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              저장
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
