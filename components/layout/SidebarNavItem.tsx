"use client";

import Link from "next/link";
import type { NavItem } from "@/lib/navigation";
import { NAV_ACTIVE, NAV_INACTIVE } from "@/lib/design-tokens";

type SidebarNavItemProps = {
  item: NavItem;
  isActive: boolean;
};

export default function SidebarNavItem({ item, isActive }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`sidebar-nav-link relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ease-premium ${
        isActive ? NAV_ACTIVE : NAV_INACTIVE
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-brand" />
      )}
      <Icon
        size={20}
        className={`shrink-0 ${isActive ? "text-navy" : ""}`}
        strokeWidth={isActive ? 2 : 1.5}
      />
      <span className="sidebar-label text-[13px]">{item.label}</span>
    </Link>
  );
}
