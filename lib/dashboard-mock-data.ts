import type {
  ActivityItem,
  AuditAnomaly,
  AIReportSummary,
  BudgetCategorySlice,
  CalendarEvent,
  MonthlyBudgetPoint,
  DashboardTransaction,
} from "@/lib/dashboard-types";
import { CATEGORY_COLORS } from "@/lib/chart-colors";
import { enrichTrendWithMoM } from "@/lib/dashboard-utils";

export const BUDGET_TOTAL = 8_000_000;
export const BUDGET_USED = 5_320_000;
export const BUDGET_REMAINING = 2_680_000;
export const BUDGET_USAGE_PERCENT = 66;
export const BUDGET_USAGE_SPEED_PERCENT = 12;
export const AMOUNT_THRESHOLD = 300_000;

export const BUDGET_SLICES: BudgetCategorySlice[] = [
  { category: "행사비", percent: 35, amount: 1_862_000, color: CATEGORY_COLORS.행사비 },
  { category: "식비", percent: 24, amount: 1_276_800, color: CATEGORY_COLORS.식비 },
  { category: "운영비", percent: 14, amount: 744_800, color: CATEGORY_COLORS.운영비 },
  { category: "교통비", percent: 11, amount: 585_200, color: CATEGORY_COLORS.교통비 },
  { category: "장비비", percent: 9, amount: 478_800, color: CATEGORY_COLORS.장비비 },
  { category: "기타", percent: 7, amount: 372_400, color: CATEGORY_COLORS.기타 },
];

export const DOUGHNUT_CENTER_PERCENT = 74;

const MT_TRANSACTION: DashboardTransaction = {
  id: "tx-001",
  merchant: "학생 MT 펜션",
  category: "행사비",
  date: "2026-07-02",
  dateLabel: "7월 2일",
  amount: 850_000,
  balance: 2_680_000,
  status: "review",
  paymentMethod: "학생회 체크카드",
  transactionId: "TX-20260702-001",
  hasReceipt: false,
  aiConfidence: 97,
};

export const PENDING_AUDIT_TRANSACTION = MT_TRANSACTION;

export const ANOMALY_QUEUE: AuditAnomaly[] = [
  {
    id: "anomaly-1",
    type: "schedule_mismatch",
    transaction: MT_TRANSACTION,
    reason:
      "학생 MT 일정(7월 12일)이 등록되어 있으나, 관련 거래 패턴과 일정 시점이 일치하지 않습니다.",
    confidence: 92,
    relatedSchedule: "학생회 MT",
    relatedScheduleId: "ev-1",
  },
  {
    id: "anomaly-2",
    type: "amount_threshold",
    transaction: MT_TRANSACTION,
    reason: `₩${AMOUNT_THRESHOLD.toLocaleString()}원 이상 결제로 공동 승인이 필요합니다.`,
    confidence: 99,
    ruleReference: "학생회 회칙 제3조 — 30만원 이상 결제는 공동 승인 필요",
  },
  {
    id: "anomaly-3",
    type: "low_confidence",
    transaction: {
      id: "tx-005",
      merchant: "편의점 CU",
      category: "기타",
      date: "2026-07-04",
      dateLabel: "7월 4일",
      amount: 28_500,
      balance: 2_651_500,
      status: "review",
      paymentMethod: "학생회 체크카드",
      transactionId: "TX-20260704-001",
      aiConfidence: 72,
    },
    reason: "AI 분류 신뢰도가 80% 이하입니다. 카테고리를 확인해 주세요.",
    confidence: 72,
  },
  {
    id: "anomaly-4",
    type: "rule_violation",
    transaction: {
      id: "tx-006",
      merchant: "한식당 모임",
      category: "식비",
      date: "2026-07-01",
      dateLabel: "7월 1일",
      amount: 180_000,
      balance: 2_500_000,
      status: "review",
      paymentMethod: "학생회 체크카드",
      transactionId: "TX-20260701-001",
      aiConfidence: 88,
    },
    reason: "회칙상 식비 1인당 20,000원 한도를 초과했을 가능성이 있습니다. (1인당 약 45,000원)",
    confidence: 88,
    ruleReference: "식비 1인당 20,000원",
  },
  {
    id: "anomaly-5",
    type: "duplicate_payment",
    transaction: {
      id: "tx-007",
      merchant: "MT 펜션 예약",
      category: "행사비",
      date: "2026-07-03",
      dateLabel: "7월 3일",
      amount: 850_000,
      balance: 1_830_000,
      status: "review",
      paymentMethod: "학생회 체크카드",
      transactionId: "TX-20260703-001",
      hasReceipt: false,
      aiConfidence: 96,
    },
    reason:
      "동일 가맹점·동일 금액(₩850,000) 거래가 7월 2일에 이미 처리되었습니다. 중복 결제 여부를 확인해 주세요.",
    confidence: 94,
    ruleReference: "TX-20260702-001",
  },
];

export const RECENT_TRANSACTIONS: DashboardTransaction[] = [
  {
    id: "tx-001",
    merchant: "MT 펜션 예약",
    category: "행사비",
    date: "2026-07-02",
    dateLabel: "7월 2일",
    amount: 850_000,
    balance: 2_680_000,
    status: "review",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260702-001",
    hasReceipt: false,
    aiConfidence: 97,
  },
  {
    id: "tx-002",
    merchant: "김밥천국",
    category: "식비",
    date: "2026-07-03",
    dateLabel: "7월 3일",
    amount: 42_000,
    balance: 2_638_000,
    status: "completed",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260703-001",
    hasReceipt: true,
    aiConfidence: 96,
  },
  {
    id: "tx-003",
    merchant: "전자상가",
    category: "장비비",
    date: "2026-07-05",
    dateLabel: "7월 5일",
    amount: 120_000,
    balance: 2_518_000,
    status: "completed",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260705-001",
    hasReceipt: false,
    aiConfidence: 94,
  },
  {
    id: "tx-004",
    merchant: "프린트카페",
    category: "운영비",
    date: "2026-07-06",
    dateLabel: "7월 6일",
    amount: 18_000,
    balance: 2_500_000,
    status: "completed",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260706-001",
    hasReceipt: true,
    aiConfidence: 98,
  },
];

export const ALL_TRANSACTIONS: DashboardTransaction[] = [
  ...RECENT_TRANSACTIONS,
  {
    id: "tx-005",
    merchant: "편의점 CU",
    category: "기타",
    date: "2026-07-04",
    dateLabel: "7월 4일",
    amount: 28_500,
    balance: 2_471_500,
    status: "review",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260704-001",
    hasReceipt: false,
    aiConfidence: 72,
  },
  {
    id: "tx-006",
    merchant: "한식당 모임",
    category: "식비",
    date: "2026-07-01",
    dateLabel: "7월 1일",
    amount: 180_000,
    balance: 2_291_500,
    status: "review",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260701-001",
    hasReceipt: false,
    aiConfidence: 88,
  },
  {
    id: "tx-007",
    merchant: "교보문고",
    category: "운영비",
    date: "2026-06-28",
    dateLabel: "6월 28일",
    amount: 65_000,
    balance: 2_226_500,
    status: "completed",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260628-001",
    hasReceipt: true,
    aiConfidence: 95,
  },
  {
    id: "tx-008",
    merchant: "버스 대절",
    category: "교통비",
    date: "2026-06-25",
    dateLabel: "6월 25일",
    amount: 220_000,
    balance: 2_006_500,
    status: "completed",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260625-001",
    hasReceipt: true,
    aiConfidence: 93,
  },
];

export const MONTHLY_BUDGET_TREND: MonthlyBudgetPoint[] = enrichTrendWithMoM([
  { month: "1월", used: 620_000, budget: 1_200_000, balance: 580_000 },
  { month: "2월", used: 780_000, budget: 1_200_000, balance: 420_000 },
  { month: "3월", used: 1_050_000, budget: 1_200_000, balance: 150_000 },
  { month: "4월", used: 890_000, budget: 1_200_000, balance: 310_000 },
  { month: "5월", used: 1_120_000, budget: 1_200_000, balance: 80_000 },
  { month: "6월", used: 860_000, budget: 1_200_000, balance: 340_000 },
]);

export const AI_REPORT_SUMMARY: AIReportSummary = {
  confidence: 98,
  foodMoM: -4.2,
  eventMoM: 8.1,
  opsMoM: 2.3,
  overBudgetItems: ["행사비"],
  ruleViolations: 1,
  anomalyCount: 3,
  lines: [
    "전달 대비 식비는 4.2% 감소했습니다.",
    "전달 대비 행사비는 8.1% 증가했습니다.",
    "전달 대비 운영비는 2.3% 증가했습니다.",
    "행사비가 예산을 초과했습니다.",
    "회칙 위반 가능 1건, 이상 거래 3건이 감지되었습니다.",
  ],
};

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "ev-1", title: "학생회 MT", date: 12, month: 7, year: 2026, color: CATEGORY_COLORS.행사비, description: "2박 3일 MT 일정" },
  { id: "ev-2", title: "정기 총회", date: 18, month: 7, year: 2026, color: CATEGORY_COLORS.운영비, description: "7월 정기 총회" },
  { id: "ev-3", title: "신입생 환영회", date: 25, month: 7, year: 2026, color: CATEGORY_COLORS.식비, description: "신입생 환영 행사" },
  { id: "ev-4", title: "예산 검토", date: 6, month: 7, year: 2026, color: CATEGORY_COLORS.교통비, description: "월간 예산 검토 회의" },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: "act-1",
    time: "3분 전",
    message: "김밥천국을 식비로 분류했습니다.",
    hasDogIcon: true,
  },
  {
    id: "act-2",
    time: "12분 전",
    message: "공동 승인이 완료되었습니다.",
  },
  {
    id: "act-3",
    time: "35분 전",
    message: "새 일정이 등록되었습니다.",
  },
  {
    id: "act-4",
    time: "1시간 전",
    message: "AI 회계 리포트가 생성되었습니다.",
    hasDogIcon: true,
  },
  {
    id: "act-5",
    time: "Yesterday",
    message: "새 구성원이 초대되었습니다.",
  },
];

export const AI_CHAT_SUGGESTIONS = [
  "이번 MT 예산은 얼마 사용되었나요?",
  "이번 달 식비는 얼마인가요?",
  "가장 큰 지출은 무엇인가요?",
  "회칙 위반 거래가 있나요?",
];

export const AI_CHAT_RESPONSES: Record<string, string> = {
  "이번 MT 예산은 얼마 사용되었나요?":
    "이번 MT 관련 지출은 ₩850,000이에요. 학생 MT 펜션 예약 건이 검토 대기 중입니다.",
  "이번 달 식비는 얼마인가요?":
    "이번 달 식비는 ₩1,276,800으로 전체 예산의 24%를 차지해요.",
  "가장 큰 지출은 무엇인가요?":
    "가장 큰 지출은 MT 펜션 예약 ₩850,000 (행사비)입니다.",
  "회칙 위반 거래가 있나요?":
    "회칙 위반 가능 거래 1건이 있어요. 한식당 모임 ₩180,000 — 식비 1인당 한도 초과 가능성이 있습니다.",
};
