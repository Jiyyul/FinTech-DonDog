"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CalendarCard from "@/components/dashboard/CalendarCard";
import ScheduleFormModal from "@/components/dashboard/ScheduleFormModal";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import type { CalendarEvent } from "@/lib/dashboard-types";

export default function CalendarPage() {
  const { calendarEvents: initialEvents, paymentCalendarItems } = useDashboardData();
  const [events, setEvents] = useState(initialEvents);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const handleSave = (event: Omit<CalendarEvent, "id"> & { id?: string }) => {
    if (event.id) {
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, ...event, id: event.id } : e))
      );
    } else {
      setEvents((prev) => [...prev, { ...event, id: `ev-${Date.now()}` }]);
    }
    setEditing(null);
  };

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-[14px] font-medium text-ink2 transition-colors duration-200 hover:text-navy"
      >
        <ArrowLeft size={18} strokeWidth={1.75} />
        대시보드
      </Link>

      <div className="mb-8">
        <p className="dash-section-label normal-case tracking-normal">일정</p>
        <h1 className="ui-page-title mt-1">모임 일정</h1>
      </div>

      <CalendarCard
        events={events}
        payments={paymentCalendarItems}
        onAddEvent={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        onSelectEvent={(event) => {
          setEditing(event);
          setFormOpen(true);
        }}
      />

      <ScheduleFormModal
        open={formOpen}
        initial={editing}
        year={2026}
        month={7}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSave={handleSave}
        onDelete={(id) => {
          setEvents((prev) => prev.filter((e) => e.id !== id));
          setEditing(null);
        }}
      />
    </div>
  );
}
