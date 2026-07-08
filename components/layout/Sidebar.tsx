"use client";

import { usePathname } from "next/navigation";
import DonDogLogo from "@/components/layout/DonDogLogo";
import OrganizationSwitcher from "@/components/layout/OrganizationSwitcher";
import SidebarNavItem from "@/components/layout/SidebarNavItem";
import SidebarUser from "@/components/layout/SidebarUser";
import { NAV_ITEMS } from "@/lib/navigation";
import { useMockUser } from "@/components/providers/MockUserProvider";

export default function Sidebar() {
  const pathname = usePathname();
  const { organizations, openAddGroupModal } = useMockUser();

  return (
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
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <SidebarNavItem key={item.href} item={item} isActive={isActive} />
          );
        })}
      </nav>

      <div className="mt-3 shrink-0 border-t border-hairline pt-3">
        <SidebarUser onAddGroup={openAddGroupModal} />
      </div>
    </aside>
  );
}
