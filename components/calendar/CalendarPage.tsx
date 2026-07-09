"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import CalendarCard from "@/components/dashboard/CalendarCard";
import ScheduleFormModal from "@/components/dashboard/ScheduleFormModal";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { deleteScheduleAction, saveScheduleAction } from "@/lib/actions/schedule-actions";
import type { CalendarEvent } from "@/lib/dashboard-types";

export default function CalendarPage() {
  const router = useRouter();
  const { calendarEvents: initialEvents } = useDashboardData();
  const [events, setEvents] = useState(initialEvents);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const handleSave = async (event: Omit<CalendarEvent, "id"> & { id?: string }) => {
    const saved = await saveScheduleAction(event);
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === saved.id);
      return exists ? prev.map((e) => (e.id === saved.id ? saved : e)) : [...prev, saved];
    });
    setEditing(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setEditing(null);
    await deleteScheduleAction(id);
    router.refresh();
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
        onDelete={handleDelete}
      />
    </div>
  );
}
