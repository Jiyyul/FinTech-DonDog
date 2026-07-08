import AppShell from "@/components/layout/AppShell";
import { DashboardDataProvider } from "@/components/providers/DashboardDataProvider";
import { getDashboardData } from "@/lib/get-dashboard-data";

// 결제/예산/이상거래 데이터는 매 요청마다 Supabase에서 새로 읽어야 한다.
// (npm run classify 같은 외부 스크립트가 Next.js 밖에서 DB를 바꾸므로,
// Next.js의 기본 fetch 캐시에 의존하면 새 데이터가 반영되지 않는다.)
export const dynamic = "force-dynamic";

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
