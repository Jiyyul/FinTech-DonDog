import BudgetManagementPage from "@/components/budget/BudgetManagementPage";
import { getBudgetData } from "@/lib/get-budget-data";

export const dynamic = "force-dynamic";

export default async function BudgetPage() {
  const data = await getBudgetData();
  return <BudgetManagementPage data={data} />;
}
