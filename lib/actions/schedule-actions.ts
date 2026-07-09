"use server";

import { revalidatePath } from "next/cache";
import { deleteSchedule, saveSchedule } from "@/lib/schedule-repository";
import { requireAccountantSession } from "@/lib/auth-server";
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
  const session = requireAccountantSession();
  const saved = await saveSchedule(session.groupId, event);
  revalidateCalendarPaths();
  return saved;
}

export async function deleteScheduleAction(id: string): Promise<void> {
  const session = requireAccountantSession();
  await deleteSchedule(session.groupId, id);
  revalidateCalendarPaths();
}
