import {
  CheckCircle2,
  CalendarPlus,
  UserPlus,
  FileText,
  Sparkles,
} from "lucide-react";
import Card from "@/components/common/Card";
import { ACTIVITY_FEED } from "@/lib/dashboard-mock-data";

const iconMap: Record<string, React.ElementType> = {
  "act-1": Sparkles,
  "act-2": CheckCircle2,
  "act-3": CalendarPlus,
  "act-4": UserPlus,
  "act-5": FileText,
};

export default function ActivityFeedCard({ className = "" }: { className?: string }) {
  return (
    <Card className={`flex min-w-0 flex-col ${className}`}>
      <h3 className="dash-card-title mb-6 shrink-0">최근 활동</h3>

      <div className="relative flex-1">
        <div className="absolute bottom-2 left-[11px] top-2 w-px bg-hairline" />

        <ul className="space-y-7">
          {ACTIVITY_FEED.map((item) => {
            const Icon = iconMap[item.id] ?? CheckCircle2;

            return (
              <li
                key={item.id}
                className="group relative flex gap-4 transition-opacity duration-200"
              >
                <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-transform duration-200 ease-premium group-hover:scale-105">
                  {item.hasDogIcon ? (
                    <span className="text-[10px]">🐶</span>
                  ) : (
                    <Icon
                      size={12}
                      className={
                        item.id === "act-1" ? "text-accent" : "text-ink2"
                      }
                      strokeWidth={1.5}
                    />
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
