import AppShell from "@/components/layout/AppShell";
import { DashboardDataProvider } from "@/components/providers/DashboardDataProvider";
import { getDashboardData } from "@/lib/get-dashboard-data";

// 레이아웃에 force-dynamic을 걸면 (main) 그룹 내 페이지 간 클라이언트 사이드 이동
// (예: 대시보드 -> /receipts)이 RSC 요청은 성공하지만 URL/화면이 갱신되지 않는
// 문제가 있었다 (Next.js가 공유 레이아웃을 매번 강제로 다시 렌더링하려다 소프트
// 내비게이션을 완료하지 못함). 결제/예산 등 실데이터를 다루는 모든 변경 액션은
// 이미 각자 router.refresh()를 호출해 최신 데이터를 반영하므로, 레이아웃 레벨의
// force-dynamic 없이도 신선도 문제가 없다.

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getDashboardData();

  return (
    <DashboardDataProvider data={data}>
      <AppShell>{children}</AppShell>
    </DashboardDataProvider>
  );
}
