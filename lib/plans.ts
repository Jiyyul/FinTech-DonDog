export type PlanId = "free" | "pro" | "team" | "club";

export type PaidPlanId = Exclude<PlanId, "free">;

export type Plan = {
  id: PlanId;
  name: string;
  productName: string;
  amount: number;
  priceLabel: string;
  period: string;
  description: string;
  organizationLimit: string;
  features: string[];
  limitations?: string[];
  cta: string;
  featured?: boolean;
};

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    productName: "돈독 Free",
    amount: 0,
    priceLabel: "무료",
    period: "",
    description: "소규모 동아리를 위한 기본 기능",
    organizationLimit: "1개",
    features: [
      "계좌·카드 연동",
      "거래내역 자동 조회",
      "AI 거래 분류 월 15건",
      "OCR 영수증 인식",
      "AI 이상거래 탐지",
    ],
    limitations: ["PDF·Excel 보고서 제공하지 않음", "공동 관리자 제공하지 않음"],
    cta: "무료로 시작",
  },
  pro: {
    id: "pro",
    name: "Pro",
    productName: "돈독 Pro",
    amount: 5_900,
    priceLabel: "₩5,900",
    period: "월",
    description: "활발한 동아리를 위한 추천 플랜",
    organizationLimit: "3개",
    features: [
      "계좌·카드 연동",
      "거래내역 자동 조회",
      "AI 거래 분류 월 30건",
      "OCR 영수증 인식",
      "PDF·Excel 보고서",
      "AI 이상거래 탐지",
      "공동 관리자 1명",
    ],
    cta: "Pro 시작하기",
    featured: true,
  },
  team: {
    id: "team",
    name: "Team",
    productName: "돈독 Team",
    amount: 9_900,
    priceLabel: "₩9,900",
    period: "월",
    description: "여러 동아리를 운영하는 학생회",
    organizationLimit: "7개",
    features: [
      "계좌·카드 연동",
      "거래내역 자동 조회",
      "AI 거래 분류 무제한",
      "OCR 영수증 인식",
      "PDF·Excel 보고서",
      "AI 이상거래 탐지",
      "공동 관리자 5명",
    ],
    cta: "Team 시작하기",
  },
  club: {
    id: "club",
    name: "Club",
    productName: "돈독 Club",
    amount: 19_900,
    priceLabel: "₩19,900",
    period: "월",
    description: "대규모 학생회·연합회",
    organizationLimit: "무제한",
    features: [
      "계좌·카드 연동",
      "거래내역 자동 조회",
      "AI 거래 분류 무제한",
      "OCR 영수증 인식",
      "PDF·Excel 보고서",
      "AI 이상거래 탐지",
      "공동 관리자 무제한",
    ],
    cta: "Club 시작하기",
  },
};

export const PLANS_LIST: Plan[] = Object.values(PLANS);

export const PAID_PLAN_IDS: PaidPlanId[] = ["pro", "team", "club"];

export function getPlan(id: PlanId): Plan {
  return PLANS[id];
}

export function isPaidPlanId(id: string): id is PaidPlanId {
  return id === "pro" || id === "team" || id === "club";
}

export function formatPlanPrice(plan: Plan): string {
  if (plan.amount === 0) return plan.priceLabel;
  return plan.period ? `${plan.priceLabel} / ${plan.period}` : plan.priceLabel;
}
