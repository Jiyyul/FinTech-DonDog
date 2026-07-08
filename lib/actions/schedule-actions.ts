"use server";

import { revalidatePath } from "next/cache";
import { deleteSchedule, saveSchedule } from "@/lib/schedule-repository";
import type { CalendarEvent } from "@/lib/dashboard-types";

function revalidateCalendarPaths() {
  revalidatePath("/");
  revalidatePath("/calendar");
  revalidatePath("/audit");
  revalidatePath("/audit/overview");
}

export async function saveScheduleAction(
  event: Omit<CalendarEvent, "id"> & { id?: string }
): Promise<CalendarEvent> {
  const saved = await saveSchedule(event);
  revalidateCalendarPaths();
  return saved;
}

export async function deleteScheduleAction(id: string): Promise<void> {
  await deleteSchedule(id);
  revalidateCalendarPaths();
}
