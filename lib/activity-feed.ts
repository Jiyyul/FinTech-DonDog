import type { ActivityIcon, ActivityItem } from "@/lib/dashboard-types";

export function createActivity(
  message: string,
  options?: { hasDogIcon?: boolean; icon?: ActivityIcon }
): ActivityItem {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time: "방금",
    message,
    ...options,
  };
}

export function prependActivity(
  items: ActivityItem[],
  message: string,
  options?: { hasDogIcon?: boolean; icon?: ActivityIcon },
  maxItems = 20
): ActivityItem[] {
  return [createActivity(message, options), ...items].slice(0, maxItems);
}
