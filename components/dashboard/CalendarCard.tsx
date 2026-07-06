"use client";

import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/common/Card";
import { CALENDAR_EVENTS } from "@/lib/dashboard-mock-data";

const YEAR = 2026;
const MONTH = 6;
const TODAY = 6;

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarCard({
  variant = "default",
  className = "",
}: {
  variant?: "default" | "compact";
  className?: string;
}) {
  const isCompact = variant === "compact";
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);
  const daysInMonth = getDaysInMonth(YEAR, MONTH);
  const firstDay = getFirstDayOfMonth(YEAR, MONTH);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsForDate = (date: number) =>
    CALENDAR_EVENTS.filter(
      (e) => e.date === date && e.month === MONTH + 1 && e.year === YEAR
    );

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
          <button type="button" className="ui-icon-btn h-8 w-8" aria-label="이전 달">
            <ChevronLeft size={15} strokeWidth={1.5} />
          </button>
          <span className="min-w-[80px] text-center text-[13px] font-medium text-ink">
            2026년 7월
          </span>
          <button type="button" className="ui-icon-btn h-8 w-8" aria-label="다음 달">
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

          const isToday = date === TODAY;
          const events = eventsForDate(date);
          const isHovered = hoveredDate === date;

          return (
            <div
              key={date}
              className="relative"
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <button
                type="button"
                className={`flex w-full items-center justify-center rounded-lg font-medium transition-all duration-200 ease-premium ${
                  isCompact ? "h-7 text-[12px]" : "h-8 text-[13px]"
                } ${
                  isToday
                    ? "bg-navy font-semibold text-inverse shadow-sm"
                    : isHovered
                      ? "bg-surface text-ink"
                      : "text-ink2 hover:bg-surface"
                }`}
              >
                {date}
              </button>
              {events.length > 0 && (
                <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-0.5">
                  {events.slice(0, 2).map((ev) => (
                    <span
                      key={ev.id}
                      className="h-1 w-1 rounded-full"
                      style={{ backgroundColor: ev.color }}
                    />
                  ))}
                </div>
              )}

              {isHovered && events.length > 0 && (
                <div className="absolute left-1/2 top-full z-10 mt-1.5 w-36 -translate-x-1/2 rounded-xl border border-hairline bg-card p-2 shadow-card-hover">
                  {events.map((ev) => (
                    <span
                      key={ev.id}
                      className="mb-1 block truncate rounded-md px-2 py-0.5 text-[10px] font-medium last:mb-0"
                      style={{
                        backgroundColor: `${ev.color}12`,
                        color: ev.color,
                      }}
                    >
                      {ev.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!isCompact && (
        <div className="mt-4 flex shrink-0 flex-wrap gap-2">
          {CALENDAR_EVENTS.slice(0, 3).map((ev) => (
            <span
              key={ev.id}
              className="rounded-full px-2.5 py-1 text-[11px] font-medium"
              style={{
                backgroundColor: `${ev.color}10`,
                color: ev.color,
              }}
            >
              {ev.title}
            </span>
          ))}
        </div>
      )}

      <button
        type="button"
        className={`absolute flex h-9 w-9 items-center justify-center rounded-full bg-brand text-ink shadow-card transition-all duration-200 ease-premium hover:scale-[1.04] hover:brightness-95 hover:shadow-card-hover ${
          isCompact ? "bottom-5 right-5" : "bottom-7 right-7 h-10 w-10"
        }`}
        aria-label="일정 추가"
      >
        <Plus size={18} strokeWidth={2} />
      </button>
    </Card>
  );
}
