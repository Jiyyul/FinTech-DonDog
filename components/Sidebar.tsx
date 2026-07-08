"use client";

import {
  LayoutDashboard,
  Users,
  User,
  PlusCircle,
  Settings,
} from "lucide-react";
import { NAV_ACTIVE, NAV_INACTIVE } from "@/lib/design-tokens";

export type PageKey = "dashboard" | "members" | "profile" | "addgroup" | "settings";

const NAV_ITEMS: { key: PageKey; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "members", label: "Members", icon: Users },
  { key: "profile", label: "Profile", icon: User },
  { key: "addgroup", label: "Add Group", icon: PlusCircle },
  { key: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  active,
  onNavigate,
}: {
  active: PageKey;
  onNavigate: (page: PageKey) => void;
}) {
  return (
    <aside className="group sticky top-0 flex h-screen w-20 flex-shrink-0 overflow-hidden border-r border-hairline bg-sidebar transition-all duration-300 ease-premium hover:w-60">
      <div className="flex items-center gap-2.5 whitespace-nowrap px-5 py-5">
        <span className="text-xl">🐶</span>
        <span className="sidebar-label text-base font-bold text-navy">Don Dog</span>
      </div>

      <nav className="flex flex-col gap-1 px-3.5">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`relative flex items-center gap-3.5 whitespace-nowrap rounded-xl px-3 py-2.5 transition-colors duration-200 ${
                isActive ? NAV_ACTIVE : NAV_INACTIVE
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-brand" />
              )}
              <Icon size={19} className={`flex-shrink-0 ${isActive ? "text-navy" : ""}`} />
              <span className="sidebar-label text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
