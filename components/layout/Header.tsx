"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarPlus,
  CheckCircle2,
  Clock,
  FileText,
  UserPlus,
} from "lucide-react";
import SearchBar from "@/components/common/SearchBar";
import Avatar from "@/components/common/Avatar";
import { useSearch } from "@/components/layout/SearchProvider";
import { useDashboardData } from "@/components/providers/DashboardDataProvider";
import { useMockUser } from "@/components/providers/MockUserProvider";
import { useMockSession } from "@/components/auth/useMockSession";
import { getUserInitials } from "@/lib/mock-auth";
import { getNavItemByPath } from "@/lib/navigation";
import { formatCurrency } from "@/lib/format";
import { matchesSearch } from "@/lib/search-utils";
import type { ActivityIcon, ActivityItem } from "@/lib/dashboard-types";

const activityIconMap: Record<ActivityIcon, React.ElementType> = {
  check: CheckCircle2,
  calendar: CalendarPlus,
  clock: Clock,
  user: UserPlus,
  file: FileText,
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { allTransactions, activityFeed } = useDashboardData();
  const { query, setQuery, requestSelectTransaction } = useSearch();
  const { currentOrganization } = useMockUser();
  const { session } = useMockSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const notifications = activityFeed.slice(0, 3);

  const currentNav = getNavItemByPath(pathname);
  const pageTitle = currentNav?.label ?? "Dashboard";
  const isDashboard = pathname === "/" || pathname === "/dashboard";

  const searchTransactions = allTransactions;

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchTransactions.filter((tx) => matchesSearch(tx, query)).slice(0, 6);
  }, [query, searchTransactions]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (!notificationRef.current?.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const handleSelectResult = (transactionId: string) => {
    requestSelectTransaction(transactionId);
    setDropdownOpen(false);
    if (!isDashboard) router.push("/");
  };

  return (
    <header
      className={`ui-shell-pad sticky top-0 z-30 flex min-h-[88px] flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4 backdrop-blur-xl ${
        isDashboard ? "bg-dashbg/90" : "bg-appbg/90"
      }`}
    >
      <div className="min-w-0 flex-1 basis-[12rem]">
        <h1 className="ui-page-title">{pageTitle}</h1>
        <p className="ui-page-subtitle">
          {currentOrganization?.semester ?? "모임을 선택하거나 새로 만들어보세요"}
        </p>
      </div>

      <div className="flex w-full min-w-0 shrink-0 flex-wrap items-center justify-end gap-2.5 sm:w-auto">
        <div ref={searchRef} className="relative w-full min-w-0 max-w-[320px] shrink-0 sm:w-auto">
          <SearchBar
            className="w-full min-w-[10rem] max-w-[260px] flex-1 sm:flex-none"
            value={query}
            onChange={(value) => {
              setQuery(value);
              setDropdownOpen(true);
            }}
            onFocus={() => setDropdownOpen(true)}
          />

          {dropdownOpen && query.trim() && (
            <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover">
              {results.length > 0 ? (
                <ul className="max-h-72 overflow-y-auto py-1">
                  {results.map((tx) => (
                    <li key={tx.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectResult(tx.id)}
                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-surface"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-medium text-ink">
                            {tx.merchant}
                          </p>
                          <p className="mt-0.5 text-[12px] text-muted">
                            {tx.category} · {tx.dateLabel}
                          </p>
                        </div>
                        <span className="shrink-0 text-[13px] font-semibold tabular-nums text-navy">
                          {formatCurrency(tx.amount)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-5 text-center text-[13px] text-muted">
                  검색 결과가 없습니다.
                </p>
              )}
            </div>
          )}
        </div>

        <div ref={notificationRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setNotificationOpen((open) => !open)}
            className="ui-icon-btn relative border border-hairline bg-card shadow-card"
            aria-label="알림"
            aria-expanded={notificationOpen}
          >
            <Bell size={20} className="text-ink2" strokeWidth={1.5} />
            {notifications.length > 0 && (
              <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-card" />
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-[min(280px,calc(100vw-2rem))] overflow-hidden rounded-modal border border-hairline bg-card shadow-card-hover">
              <div className="border-b border-hairline px-3.5 py-2.5">
                <p className="text-[12px] font-semibold text-ink">최근 활동</p>
              </div>
              {notifications.length > 0 ? (
                <ul className="divide-y divide-hairline">
                  {notifications.map((item) => (
                    <NotificationItem key={item.id} item={item} />
                  ))}
                </ul>
              ) : (
                <p className="px-3.5 py-4 text-center text-[12px] text-muted">
                  아직 활동 내역이 없습니다.
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="shrink-0 rounded-full transition-transform duration-200 ease-premium hover:scale-[1.03]"
          aria-label="프로필"
        >
          <Avatar initials={getUserInitials(session?.user.name ?? "게스트")} size="lg" />
        </button>
      </div>
    </header>
  );
}

function NotificationItem({ item }: { item: ActivityItem }) {
  const Icon = item.icon ? activityIconMap[item.icon] : CheckCircle2;

  return (
    <li className="flex gap-2.5 px-3.5 py-2.5">
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface ring-1 ring-hairline">
        {item.hasDogIcon ? (
          <span className="text-[9px] leading-none">🐶</span>
        ) : (
          <Icon size={10} className="text-ink2" strokeWidth={1.5} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium text-muted">{item.time}</p>
        <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-ink2">{item.message}</p>
      </div>
    </li>
  );
}
