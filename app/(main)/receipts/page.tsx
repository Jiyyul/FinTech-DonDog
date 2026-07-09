import ReceiptsPage from "@/components/receipts/ReceiptsPage";
import { getServerSession } from "@/lib/auth-server";
import { getDashboardData } from "@/lib/get-dashboard-data";
import { getReceipts } from "@/lib/receipt-repository";
import { toRuleEngineTransactions } from "@/lib/anomalies/from-payments";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = getServerSession();
  if (!session) redirect("/login");

  const [dashboardData, receipts] = await Promise.all([
    getDashboardData(session.groupId),
    getReceipts(session.groupId),
  ]);
  const transactions = toRuleEngineTransactions(dashboardData.allTransactions);
  return <ReceiptsPage initialTransactions={transactions} initialReceipts={receipts} />;
}
