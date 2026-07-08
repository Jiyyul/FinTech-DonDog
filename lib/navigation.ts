import {
  LayoutDashboard,
  User,
  Download,
  ShieldAlert,
  Receipt,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/audit", label: "이상거래", icon: ShieldAlert },
  { href: "/receipts", label: "영수증", icon: Receipt },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/download", label: "Download Ledger", icon: Download },
];

export function getNavItemByPath(pathname: string): NavItem | undefined {
  if (pathname === "/dashboard") {
    return NAV_ITEMS[0];
  }
  return NAV_ITEMS.find(
    (item) => item.href !== "/dashboard" && pathname.startsWith(item.href)
  );
}
