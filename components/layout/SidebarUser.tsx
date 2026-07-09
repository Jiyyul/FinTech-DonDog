"use client";

import { useRouter } from "next/navigation";
import { LogOut, Plus } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";

type SidebarUserProps = {
  onAddGroup: () => void;
};

export default function SidebarUser({ onAddGroup }: SidebarUserProps) {
  const router = useRouter();
  const { session, isAccountant } = useAuth();

  const displayName = session.username ?? session.groupName;
  const roleLabel = isAccountant ? "회계 담당자" : "동아리 부원";
  const initials = displayName.slice(0, 2);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="space-y-2">
      {isAccountant && (
        <button
          type="button"
          onClick={onAddGroup}
          className="sidebar-add-btn flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-ink2 transition-colors duration-200 hover:bg-surface hover:text-ink"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dashed border-hairline bg-card">
            <Plus size={16} strokeWidth={1.5} />
          </div>
          <span className="sidebar-label text-[13px] font-medium">새 모임 추가</span>
        </button>
      )}

      <div className="sidebar-user-row flex items-center gap-2.5 px-1.5 py-1.5">
        <Avatar initials={initials} size="md" />
        <div className="sidebar-label min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-ink">{displayName}</p>
          <p className="truncate text-[11px] text-muted">{roleLabel}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="sidebar-logout-btn flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-ink2 transition-colors duration-200 hover:bg-surface hover:text-danger"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline bg-card">
          <LogOut size={16} strokeWidth={1.5} />
        </div>
        <span className="sidebar-label text-[13px] font-medium">로그아웃</span>
      </button>
    </div>
  );
}
