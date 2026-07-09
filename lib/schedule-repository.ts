import { getSupabase } from "@/lib/supabase";
import type { CalendarEvent } from "@/lib/dashboard-types";

type ScheduleRow = {
  id: string;
  group_id: number;
  title: string;
  event_date: string;
  color: string;
  description: string | null;
};

function mapSchedule(row: ScheduleRow): CalendarEvent {
  const [year, month, date] = row.event_date.split("-").map(Number);
  return {
    id: row.id,
    title: row.title,
    date,
    month,
    year,
    color: row.color,
    description: row.description ?? undefined,
  };
}

function toEventDate(event: { year: number; month: number; date: number }): string {
  return `${event.year}-${String(event.month).padStart(2, "0")}-${String(event.date).padStart(2, "0")}`;
}

export async function getSchedules(groupId: number): Promise<CalendarEvent[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("schedules")
    .select("*")
    .eq("group_id", groupId)
    .order("event_date", { ascending: true });

  if (error) throw new Error(`일정 조회 실패: ${error.message}`);
  return (data as ScheduleRow[]).map(mapSchedule);
}

export async function saveSchedule(
  groupId: number,
  event: Omit<CalendarEvent, "id"> & { id?: string }
): Promise<CalendarEvent> {
  const db = getSupabase();
  const id = event.id ?? `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const { data, error } = await db
    .from("schedules")
    .upsert(
      {
        id,
        group_id: groupId,
        title: event.title,
        event_date: toEventDate(event),
        color: event.color,
        description: event.description,
      },
      { onConflict: "group_id,id" }
    )
    .select("*")
    .single();

  if (error) throw new Error(`일정 저장 실패: ${error.message}`);
  return mapSchedule(data as ScheduleRow);
}

export async function deleteSchedule(groupId: number, id: string): Promise<void> {
  const db = getSupabase();
  const { error } = await db.from("schedules").delete().eq("group_id", groupId).eq("id", id);
  if (error) throw new Error(`일정 삭제 실패: ${error.message}`);
}

export async function seedSchedulesIfEmpty(
  groupId: number,
  defaults: CalendarEvent[]
): Promise<void> {
  const existing = await getSchedules(groupId);
  if (existing.length > 0) return;

  const db = getSupabase();
  const rows = defaults.map((event) => ({
    id: event.id,
    group_id: groupId,
    title: event.title,
    event_date: toEventDate(event),
    color: event.color,
    description: event.description,
  }));
  const { error } = await db.from("schedules").insert(rows);
  if (error) throw new Error(`일정 시드 실패: ${error.message}`);
}
