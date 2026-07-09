import BudgetManagementPage from "@/components/budget/BudgetManagementPage";
import { getServerSession } from "@/lib/auth-server";
import { getBudgetData } from "@/lib/get-budget-data";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const session = getServerSession();
  if (!session) redirect("/login");

  const data = await getBudgetData(session.groupId);
  return <BudgetManagementPage data={data} />;
}
