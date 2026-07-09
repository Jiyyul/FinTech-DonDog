import {
  CheckCircle2,
  CalendarPlus,
  UserPlus,
  FileText,
  Clock,
} from "lucide-react";
import Card from "@/components/common/Card";
import type { ActivityIcon, ActivityItem } from "@/lib/dashboard-types";

const iconMap: Record<ActivityIcon, React.ElementType> = {
  check: CheckCircle2,
  calendar: CalendarPlus,
  clock: Clock,
  user: UserPlus,
  file: FileText,
};

type ActivityFeedCardProps = {
  activities: ActivityItem[];
  className?: string;
};

export default function ActivityFeedCard({
  activities,
  className = "",
}: ActivityFeedCardProps) {
  return (
    <Card className={`flex min-w-0 flex-col ${className}`}>
      <h3 className="dash-card-title mb-6 shrink-0">최근 활동</h3>

      <div className="relative flex-1">
        <div className="absolute bottom-2 left-[11px] top-2 w-px bg-hairline" />

        <ul className="space-y-7">
          {activities.map((item) => {
            const Icon = item.icon ? iconMap[item.icon] : CheckCircle2;

            return (
              <li
                key={item.id}
                className="group relative flex gap-4 transition-opacity duration-200"
              >
                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-transform duration-200 ease-premium group-hover:scale-105">
                  {item.hasDogIcon ? (
                    <span className="text-[10px]">🐶</span>
                  ) : (
                    <Icon size={12} className="text-ink2" strokeWidth={1.5} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium uppercase tracking-label-wide text-muted">
                    {item.time}
                  </p>
                  <p className="mt-1 text-[14px] leading-relaxed text-ink2">
                    {item.message}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Card>
  );
}
