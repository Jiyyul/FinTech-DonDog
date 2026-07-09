import {
  LayoutDashboard,
  User,
  Download,
  Receipt,
  CreditCard,
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
  { href: "/transactions", label: "거래내역", icon: CreditCard },
  { href: "/audit", label: "이상거래", icon: ShieldAlert },
  { href: "/receipts", label: "영수증", icon: Receipt },
  { href: "/calendar", label: "캘린더", icon: Calendar },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/download", label: "Download Ledger", icon: Download },
];

export function getNavItemByPath(pathname: string): NavItem | undefined {
  if (pathname === "/" || pathname === "/dashboard") {
    return NAV_ITEMS[0];
  }
  return NAV_ITEMS.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href)
  );
}
