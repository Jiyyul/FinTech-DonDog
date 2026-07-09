"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ChevronDown, Check } from "lucide-react";
import type { Organization } from "@/lib/mock-data";

type OrganizationSwitcherProps = {
  organizations: Organization[];
  activeGroupId: string;
  allowSwitch?: boolean;
};

export default function OrganizationSwitcher({
  organizations,
  activeGroupId,
  allowSwitch = false,
}: OrganizationSwitcherProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const selected =
    organizations.find((org) => org.id === activeGroupId) ?? organizations[0] ?? null;

  if (organizations.length === 0) {
    return (
      <div className="org-switcher-btn flex w-full items-center gap-2.5 rounded-xl px-1.5 py-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface ring-1 ring-hairline">
          <Building2 size={16} className="text-muted" strokeWidth={1.5} />
        </div>
        <div className="sidebar-label min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-muted">모임 없음</p>
        </div>
      </div>
    );
  }

  const showSwitcher = allowSwitch && organizations.length > 1;

  const handleSelect = async (groupId: string) => {
    if (groupId === selected?.id || switching) return;
    setSwitching(true);
    try {
      const res = await fetch("/api/auth/switch-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: Number(groupId) }),
      });
      if (!res.ok) return;
      setOpen(false);
      router.refresh();
    } finally {
      setSwitching(false);
    }
  };

  if (!showSwitcher) {
    return (
      <div className="org-switcher-btn flex w-full items-center gap-2.5 rounded-xl px-1.5 py-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface ring-1 ring-hairline">
          <Building2 size={16} className="text-ink2" strokeWidth={1.5} />
        </div>
        <div className="sidebar-label min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-ink">{selected?.name}</p>
          {selected?.semester && (
            <p className="truncate text-[11px] text-muted">{selected.semester}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={switching}
        className="org-switcher-btn flex w-full items-center gap-2.5 rounded-xl px-1.5 py-2 text-left transition-colors duration-200 hover:bg-surface disabled:opacity-60"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface ring-1 ring-hairline">
          <Building2 size={16} className="text-ink2" strokeWidth={1.5} />
        </div>
        <div className="sidebar-label min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-ink">{selected?.name}</p>
          <p className="truncate text-[11px] text-muted">{selected?.semester}</p>
        </div>
        <ChevronDown
          size={14}
          className={`sidebar-label shrink-0 text-muted transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <ul
            role="listbox"
            className="sidebar-label absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-hairline bg-card p-1 shadow-card-hover"
          >
            {organizations.map((org) => {
              const isSelected = org.id === selected?.id;
              return (
                <li key={org.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(org.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      isSelected ? "bg-surface" : "hover:bg-surface"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-ink">{org.name}</p>
                      <p className="truncate text-[11px] text-muted">{org.semester}</p>
                    </div>
                    {isSelected && (
                      <Check size={14} className="shrink-0 text-navy" strokeWidth={2} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
