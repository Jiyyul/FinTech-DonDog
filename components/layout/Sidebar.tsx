"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import DonDogLogo from "@/components/layout/DonDogLogo";
import OrganizationSwitcher from "@/components/layout/OrganizationSwitcher";
import SidebarNavItem from "@/components/layout/SidebarNavItem";
import SidebarUser from "@/components/layout/SidebarUser";
import AddGroupModal, { toOrganization } from "@/components/layout/AddGroupModal";
import type { NewGroupFormData } from "@/components/layout/AddGroupModal";
import { NAV_ITEMS } from "@/lib/navigation";
import { ORGANIZATIONS, type Organization } from "@/lib/mock-data";

export default function Sidebar() {
  const pathname = usePathname();
  const [organizations, setOrganizations] = useState<Organization[]>(ORGANIZATIONS);
  const [addGroupOpen, setAddGroupOpen] = useState(false);

  const handleAddGroup = (data: NewGroupFormData) => {
    const newOrg = toOrganization(data);
    setOrganizations((prev) => [...prev, newOrg]);
  };

  return (
    <>
      <aside className="sidebar group fixed left-3 top-3 z-50 flex h-[calc(100vh-1.5rem)] w-[72px] flex-col overflow-hidden rounded-card border border-hairline bg-sidebar p-4 shadow-card transition-[width] duration-300 ease-premium hover:w-[240px]">
        <div className="mb-5 shrink-0 pt-0.5">
          <DonDogLogo />
          <div className="mt-3">
            <OrganizationSwitcher organizations={organizations} />
          </div>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden py-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <SidebarNavItem key={item.href} item={item} isActive={isActive} />
            );
          })}
        </nav>

        <div className="mt-3 shrink-0 border-t border-hairline pt-3">
          <SidebarUser onAddGroup={() => setAddGroupOpen(true)} />
        </div>
      </aside>

      <AddGroupModal
        open={addGroupOpen}
        onClose={() => setAddGroupOpen(false)}
        onSave={handleAddGroup}
      />
    </>
  );
}
