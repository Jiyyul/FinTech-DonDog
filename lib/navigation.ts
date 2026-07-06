import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  ShieldCheck,
  FileBarChart,
  Calendar,
  Users,
  User,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "거래내역", icon: ArrowLeftRight },
  { href: "/budget", label: "예산관리", icon: Wallet },
  { href: "/audit", label: "AI 감사", icon: ShieldCheck },
  { href: "/report", label: "AI 리포트", icon: FileBarChart },
  { href: "/calendar", label: "일정", icon: Calendar },
  { href: "/members", label: "구성원", icon: Users },
  { href: "/profile", label: "프로필", icon: User },
];

export function getNavItemByPath(pathname: string): NavItem | undefined {
  if (pathname === "/") {
    return NAV_ITEMS[0];
  }
  return NAV_ITEMS.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href)
  );
}
