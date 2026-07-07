"use client";

import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/common/Card";
import type { CalendarEvent } from "@/lib/dashboard-types";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

type CalendarCardProps = {
  events: CalendarEvent[];
  variant?: "default" | "compact";
  className?: string;
  onAddEvent: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
};

export default function CalendarCard({
  events,
  variant = "default",
  className = "",
  onAddEvent,
  onSelectEvent,
}: CalendarCardProps) {
  const isCompact = variant === "compact";
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(6);
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);

  const today = new Date();
  const todayDate =
    today.getFullYear() === viewYear && today.getMonth() === viewMonth
      ? today.getDate()
      : null;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsForDate = (date: number) =>
    events.filter(
      (e) => e.date === date && e.month === viewMonth + 1 && e.year === viewYear
    );

  const shiftMonth = (delta: number) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  return (
    <Card
      className={`relative flex min-w-0 flex-col overflow-hidden ${
        isCompact ? "min-h-0" : "min-h-[420px]"
      } ${className}`}
    >
      <div
        className={`flex shrink-0 flex-wrap items-center justify-between gap-3 ${
          isCompact ? "mb-3" : "mb-4"
        }`}
      >
        <h3 className={`dash-card-title ${isCompact ? "text-base" : ""}`}>일정</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="ui-icon-btn h-8 w-8"
            aria-label="이전 달"
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeft size={15} strokeWidth={1.5} />
          </button>
          <span className="min-w-[80px] text-center text-[13px] font-medium text-ink">
            {viewYear}년 {viewMonth + 1}월
          </span>
          <button
            type="button"
            className="ui-icon-btn h-8 w-8"
            aria-label="다음 달"
            onClick={() => shiftMonth(1)}
          >
            <ChevronRight size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <span
            key={day}
            className="flex h-6 items-center justify-center text-[10px] font-medium uppercase tracking-label-wide text-muted"
          >
            {day}
          </span>
        ))}

        {cells.map((date, idx) => {
          if (!date) {
            return <div key={`empty-${idx}`} className={isCompact ? "h-7" : "h-8"} />;
          }

          const isToday = date === todayDate;
          const dayEvents = eventsForDate(date);
          const isHovered = hoveredDate === date;
          const hasEvents = dayEvents.length > 0;
          const eventColor = dayEvents[0]?.color;
          const col = idx % 7;
          const tooltipAlign =
            col <= 1
              ? "left-0 translate-x-0"
              : col >= 5
                ? "right-0 left-auto translate-x-0"
                : "left-1/2 -translate-x-1/2";

          return (
            <div
              key={date}
              className="relative overflow-visible"
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <button
                type="button"
                onClick={() => {
                  if (dayEvents.length > 0) {
                    onSelectEvent(dayEvents[0]);
                  }
                }}
                className={`flex w-full items-center justify-center rounded-lg font-medium transition-all duration-200 ease-premium ${
                  isCompact ? "h-7 text-[12px]" : "h-8 text-[13px]"
                } ${
                  hasEvents ? "cursor-pointer" : ""
                } ${
                  isToday
                    ? "bg-navy font-semibold text-inverse shadow-sm"
                    : isHovered
                      ? "bg-surface text-ink"
                      : "text-ink2 hover:bg-surface"
                }`}
              >
                {hasEvents && !isToday ? (
                  <span
                    className="flex h-[22px] w-[22px] items-center justify-center rounded-full text-[11px] font-semibold text-inverse shadow-sm"
                    style={{ backgroundColor: eventColor }}
                  >
                    {date}
                  </span>
                ) : (
                  date
                )}
              </button>

              {isHovered && dayEvents.length > 0 && (
                <div
                  className={`absolute top-full z-20 mt-1.5 w-max max-w-[11rem] rounded-xl border border-hairline bg-card p-2 shadow-card-hover ${tooltipAlign}`}
                >
                  {dayEvents.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      className="mb-1 block w-full whitespace-nowrap rounded-md px-2 py-1 text-left text-[10px] font-medium transition-colors last:mb-0 hover:bg-surface"
                      style={{ color: ev.color }}
                    >
                      {ev.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAddEvent}
        className={`absolute flex h-9 w-9 items-center justify-center rounded-full bg-brand text-inverse shadow-card transition-all duration-200 ease-premium hover:scale-[1.04] hover:brightness-110 hover:shadow-card-hover ${
          isCompact ? "bottom-5 right-5" : "bottom-7 right-7 h-10 w-10"
        }`}
        aria-label="일정 추가"
      >
        <Plus size={18} strokeWidth={2} />
      </button>
    </Card>
  );
}
