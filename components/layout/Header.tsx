"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell } from "lucide-react";
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

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { allTransactions } = useDashboardData();
  const { query, setQuery, requestSelectTransaction } = useSearch();
  const { currentOrganization, hasEmptyData } = useMockUser();
  const { session } = useMockSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const currentNav = getNavItemByPath(pathname);
  const pageTitle = currentNav?.label ?? "Dashboard";
  const isDashboard = pathname === "/" || pathname === "/dashboard";

  const searchTransactions = hasEmptyData ? [] : allTransactions;

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchTransactions.filter((tx) => matchesSearch(tx, query)).slice(0, 6);
  }, [query, searchTransactions]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setDropdownOpen(false);
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
          <Avatar initials={getUserInitials(session?.user.name ?? "게스트")} size="lg" />
        </button>
      </div>
    </header>
  );
}
