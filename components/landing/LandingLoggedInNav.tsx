"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { clearMockSession, getUserInitials, type MockUser } from "@/lib/mock-auth";

type LandingLoggedInNavProps = {
  user: MockUser;
  onNavigate?: () => void;
  className?: string;
  stacked?: boolean;
};

export default function LandingLoggedInNav({
  user,
  onNavigate,
  className = "",
  stacked = false,
}: LandingLoggedInNavProps) {
  const router = useRouter();

  const handleLogout = () => {
    clearMockSession();
    onNavigate?.();
    router.push("/landing");
  };

  const actionClass = stacked ? "w-full justify-center" : "";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${stacked ? "w-full flex-col items-stretch" : ""} ${className}`}
    >
      <div
        className="inline-flex min-w-0 items-center gap-2.5 rounded-btn border border-hairline bg-card py-1.5 pl-1.5 pr-4 shadow-sm"
        aria-label={`로그인 계정: ${user.name}`}
      >
        <Avatar initials={getUserInitials(user.name)} size="sm" />
        <span className="min-w-0 text-left">
          <span className="block truncate text-[13px] font-semibold text-ink">{user.name}</span>
          <span className="block truncate text-[11px] text-muted">{user.email}</span>
        </span>
      </div>

      <Link
        href="/dashboard"
        onClick={onNavigate}
        className={`inline-flex h-11 items-center gap-2 rounded-btn border border-hairline bg-card px-4 text-[14px] font-semibold text-ink transition-all duration-200 ease-premium hover:bg-surface hover:text-navy ${actionClass}`}
      >
        <LayoutDashboard size={16} strokeWidth={1.5} />
        대시보드로 돌아가기
      </Link>

      <button
        type="button"
        onClick={handleLogout}
        className={`inline-flex h-11 items-center gap-2 rounded-btn px-4 text-[14px] font-semibold text-ink2 transition-all duration-200 ease-premium hover:bg-surface hover:text-danger ${actionClass}`}
      >
        <LogOut size={16} strokeWidth={1.5} />
        로그아웃
      </button>
    </div>
  );
}
