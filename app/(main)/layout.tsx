import AppShell from "@/components/layout/AppShell";
import { DashboardDataProvider } from "@/components/providers/DashboardDataProvider";
import { getDashboardData } from "@/lib/get-dashboard-data";

export const dynamic = "force-dynamic";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = getDashboardData();

  return (
    <DashboardDataProvider data={data}>
      <AppShell>{children}</AppShell>
    </DashboardDataProvider>
  );
}
