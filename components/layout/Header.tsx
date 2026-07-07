"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import SearchBar from "@/components/common/SearchBar";
import Avatar from "@/components/common/Avatar";
import { getNavItemByPath } from "@/lib/navigation";
import { CURRENT_ORGANIZATION, CURRENT_USER } from "@/lib/mock-data";

export default function Header() {
  const pathname = usePathname();
  const currentNav = getNavItemByPath(pathname);
  const pageTitle = currentNav?.label ?? "Dashboard";

  const isDashboard = pathname === "/";

  return (
    <header
      className={`ui-shell-pad sticky top-0 z-30 flex min-h-[88px] flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4 backdrop-blur-xl ${
        isDashboard ? "bg-dashbg/90" : "bg-appbg/90"
      }`}
    >
      <div className="min-w-0 flex-1 basis-[12rem]">
        <h1 className="ui-page-title">{pageTitle}</h1>
        <p className="ui-page-subtitle">{CURRENT_ORGANIZATION.semester}</p>
      </div>

      <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center justify-end gap-2.5 sm:w-auto">
        <SearchBar className="w-full min-w-[10rem] max-w-[260px] flex-1 sm:flex-none" />

        <button
          type="button"
          className="ui-icon-btn relative border border-hairline bg-card shadow-card"
          aria-label="알림"
        >
          <Bell size={20} className="text-ink2" strokeWidth={1.5} />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-card" />
        </button>

        <button
          type="button"
          className="shrink-0 rounded-full transition-transform duration-200 ease-premium hover:scale-[1.03]"
          aria-label="프로필"
        >
          <Avatar initials={CURRENT_USER.initials} size="lg" />
        </button>
      </div>
    </header>
  );
}
