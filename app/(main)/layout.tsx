import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { DashboardDataProvider } from "@/components/providers/DashboardDataProvider";
import { getServerSession } from "@/lib/auth-server";
import { getDashboardData } from "@/lib/get-dashboard-data";
import { redirect } from "next/navigation";

// 결제/예산/이상거래 데이터는 매 요청마다 Supabase에서 새로 읽어야 한다.
export const dynamic = "force-dynamic";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getServerSession();
  if (!session) {
    redirect("/login");
  }

  const data = await getDashboardData(session.groupId);

  return (
    <AuthProvider session={session}>
      <DashboardDataProvider data={data}>
        <AppShell>{children}</AppShell>
      </DashboardDataProvider>
    </AuthProvider>
  );
}
