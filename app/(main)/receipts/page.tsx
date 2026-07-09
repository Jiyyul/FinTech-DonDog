import ReceiptsPage from "@/components/receipts/ReceiptsPage";
import { getDashboardData } from "@/lib/get-dashboard-data";
import { getReceipts } from "@/lib/receipt-repository";
import { toRuleEngineTransactions } from "@/lib/anomalies/from-payments";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: { transactionId?: string };
}) {
  const [dashboardData, receipts] = await Promise.all([getDashboardData(), getReceipts()]);
  const transactions = toRuleEngineTransactions(dashboardData.allTransactions);
  return (
    <ReceiptsPage
      initialTransactions={transactions}
      initialReceipts={receipts}
      initialTransactionId={searchParams.transactionId ?? null}
    />
  );
}
