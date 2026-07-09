import AppShell from "@/components/layout/AppShell";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { DashboardDataProvider } from "@/components/providers/DashboardDataProvider";
import { getServerSession } from "@/lib/auth-server";
import { getDashboardData } from "@/lib/get-dashboard-data";
import { redirect } from "next/navigation";

// 레이아웃에 force-dynamic을 걸면 (main) 그룹 내 페이지 간 클라이언트 사이드 이동
// (예: 대시보드 -> /receipts)이 RSC 요청은 성공하지만 URL/화면이 갱신되지 않는
// 문제가 있었다. 결제/예산 등 실데이터 변경 액션은 각자 router.refresh()로 반영하므로
// 레이아웃 레벨 force-dynamic은 사용하지 않는다.

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
