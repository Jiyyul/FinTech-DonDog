import {
  LayoutDashboard,
  User,
  Download,
  Receipt,
  ShieldAlert,
  Calendar,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/audit", label: "Audit", icon: ShieldAlert },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/download", label: "Download Ledger", icon: Download },
];

export function getNavItemByPath(pathname: string): NavItem | undefined {
  if (pathname === "/") {
    return NAV_ITEMS[0];
  }
  return NAV_ITEMS.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href)
  );
}
