"use client";

import { Search, Bell, Settings } from "lucide-react";

export default function Topbar() {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-[19px] font-bold text-navy">컴퓨터공학과 학생회</h1>
        <p className="mt-0.5 text-[13px] text-muted">2026년 1학기</p>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex w-56 items-center gap-2 rounded-xl border border-hairline bg-card px-3.5 py-2 focus-within:border-brand focus-within:shadow-[0_0_0_3px_rgba(196,255,77,0.2)]">
          <Search size={16} className="flex-shrink-0 text-muted" />
          <input
            placeholder="거래처, 항목 검색"
            className="w-full border-none bg-transparent text-[13px] outline-none placeholder:text-muted"
          />
        </div>

        <button className="ui-icon-btn relative border border-hairline bg-card shadow-card">
          <Bell size={18} className="text-ink2" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-card" />
        </button>

        <button className="ui-icon-btn border border-hairline bg-card shadow-card">
          <Settings size={18} className="text-ink2" />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-[13px] font-semibold text-navy ring-1 ring-hairline">
          지영
        </div>
      </div>
    </header>
  );
}
