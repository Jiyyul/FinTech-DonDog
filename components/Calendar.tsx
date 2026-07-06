"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CHART_COLORS } from "@/lib/chart-colors";
import { EventsMap } from "@/lib/types";

const DOWS = ["일", "월", "화", "수", "목", "금", "토"];

const INITIAL_EVENTS: EventsMap = {
  "2026-03-20": [{ name: "MT" }],
  "2026-03-27": [{ name: "개강총회" }],
};

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function Calendar() {
  const [calDate, setCalDate] = useState(new Date(2026, 2, 1));
  const [events, setEvents] = useState<EventsMap>(INITIAL_EVENTS);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", budget: "", place: "", memo: "" });

  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function changeMonth(delta: number) {
    setCalDate(new Date(year, month + delta, 1));
  }

  function openModal(key: string) {
    setActiveKey(key);
    setForm({ name: "", budget: "", place: "", memo: "" });
  }

  function saveEvent() {
    if (!activeKey || !form.name.trim()) {
      setActiveKey(null);
      return;
    }
    setEvents((prev) => ({
      ...prev,
      [activeKey]: [...(prev[activeKey] ?? []), { ...form }],
    }));
    setActiveKey(null);
  }

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-card border border-hairline bg-card p-5.5 shadow-card">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {year}년 {month + 1}월
        </h3>
        <div className="flex gap-1.5">
          <button
            onClick={() => changeMonth(-1)}
            className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-hairline bg-card"
          >
            <ChevronLeft size={14} className="text-ink2" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="flex h-6.5 w-6.5 items-center justify-center rounded-lg border border-hairline bg-card"
          >
            <ChevronRight size={14} className="text-ink2" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {DOWS.map((d) => (
          <div key={d} className="pb-1 text-center text-[10px] text-muted">
            {d}
          </div>
        ))}

        {cells.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />;
          const key = dateKey(year, month, day);
          const hasEvent = !!events[key]?.length;
          return (
            <button
              key={key}
              onClick={() => openModal(key)}
              title={events[key]?.map((e) => e.name).join(", ")}
              className="relative flex aspect-square flex-col items-center justify-center rounded-[10px] text-xs text-ink2 hover:bg-appbg"
            >
              {day}
              {hasEvent && (
                <span
                  className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: CHART_COLORS.행사비 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {activeKey && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35"
          onClick={() => setActiveKey(null)}
        >
          <div
            className="w-80 rounded-2xl bg-card p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 text-base font-semibold">일정 추가</h3>

            <Field label="행사명" placeholder="예: MT" value={form.name}
              onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <Field label="예산" placeholder="예: 450000" value={form.budget}
              onChange={(v) => setForm((f) => ({ ...f, budget: v }))} />
            <Field label="장소" placeholder="예: 가평 펜션" value={form.place}
              onChange={(v) => setForm((f) => ({ ...f, place: v }))} />

            <div className="mb-3.5 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted">메모</label>
              <textarea
                value={form.memo}
                onChange={(e) => setForm((f) => ({ ...f, memo: e.target.value }))}
                placeholder="참고 사항을 입력하세요"
                className="min-h-[70px] resize-y rounded-[10px] border border-hairline px-3 py-2 text-[13px] outline-none"
              />
            </div>

            <div className="mt-1.5 flex gap-2.5">
              <button
                onClick={() => setActiveKey(null)}
                className="flex-1 rounded-btn border border-hairline bg-card py-2.5 text-[13px] font-semibold hover:bg-appbg"
              >
                취소
              </button>
              <button
                onClick={saveEvent}
                className="flex-1 rounded-btn bg-brand py-2.5 text-[13px] font-semibold text-ink hover:brightness-95"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3.5 flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-[10px] border border-hairline px-3 py-2 text-[13px] outline-none"
      />
    </div>
  );
}
