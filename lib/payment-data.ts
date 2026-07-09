import type { Plan, PaidPlanId } from "@/lib/plans";
import { getPlan, isPaidPlanId, PLANS } from "@/lib/plans";

export type PaymentPlanId = PaidPlanId;

export type PaymentPlan = Plan;

export { isPaidPlanId as isPaymentPlanId };

export const PAYABLE_PLAN_IDS: PaymentPlanId[] = ["pro", "team", "club"];

export const PAYMENT_PLANS: Record<PaymentPlanId, PaymentPlan> = {
  pro: getPlan("pro"),
  team: getPlan("team"),
  club: getPlan("club"),
};

export function getPaymentPlan(id: PaymentPlanId): PaymentPlan {
  return PLANS[id];
}
