import type {
  ActivityItem,
  BudgetCategorySlice,
  CalendarEvent,
  MonthlyBudgetPoint,
  DashboardTransaction,
} from "@/lib/dashboard-types";
import { CATEGORY_COLORS } from "@/lib/chart-colors";

export const BUDGET_TOTAL = 8_000_000;
export const BUDGET_USED = 5_320_000;
export const BUDGET_REMAINING = 2_680_000;
export const BUDGET_USAGE_PERCENT = 66;
export const BUDGET_USAGE_SPEED_PERCENT = 12;

export const BUDGET_SLICES: BudgetCategorySlice[] = [
  { category: "행사비", percent: 42, amount: 2_234_400, color: CATEGORY_COLORS.행사비 },
  { category: "식비", percent: 28, amount: 1_489_600, color: CATEGORY_COLORS.식비 },
  { category: "운영비", percent: 17, amount: 904_400, color: CATEGORY_COLORS.운영비 },
  { category: "교통비", percent: 13, amount: 691_600, color: CATEGORY_COLORS.교통비 },
];

export const DOUGHNUT_CENTER_PERCENT = 74;

export const PENDING_AUDIT_TRANSACTION: DashboardTransaction = {
  id: "tx-001",
  merchant: "학생 MT 펜션",
  category: "행사비",
  date: "2026-07-02",
  dateLabel: "7월 2일",
  amount: 850_000,
  status: "review",
  paymentMethod: "학생회 체크카드",
  transactionId: "TX-20260702-001",
};

export const RECENT_TRANSACTIONS: DashboardTransaction[] = [
  {
    id: "tx-001",
    merchant: "MT 펜션 예약",
    category: "행사비",
    date: "2026-07-02",
    dateLabel: "7월 2일",
    amount: 850_000,
    status: "review",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260702-001",
  },
  {
    id: "tx-002",
    merchant: "김밥천국",
    category: "식비",
    date: "2026-07-03",
    dateLabel: "7월 3일",
    amount: 42_000,
    status: "completed",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260703-001",
  },
  {
    id: "tx-003",
    merchant: "전자상가",
    category: "장비비",
    date: "2026-07-05",
    dateLabel: "7월 5일",
    amount: 120_000,
    status: "completed",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260705-001",
  },
  {
    id: "tx-004",
    merchant: "프린트카페",
    category: "운영비",
    date: "2026-07-06",
    dateLabel: "7월 6일",
    amount: 18_000,
    status: "completed",
    paymentMethod: "학생회 체크카드",
    transactionId: "TX-20260706-001",
  },
];

export const MONTHLY_BUDGET_TREND: MonthlyBudgetPoint[] = [
  { month: "1월", used: 620_000, budget: 1_200_000, balance: 580_000 },
  { month: "2월", used: 780_000, budget: 1_200_000, balance: 420_000 },
  { month: "3월", used: 1_050_000, budget: 1_200_000, balance: 150_000 },
  { month: "4월", used: 890_000, budget: 1_200_000, balance: 310_000 },
  { month: "5월", used: 1_120_000, budget: 1_200_000, balance: 80_000 },
  { month: "6월", used: 860_000, budget: 1_200_000, balance: 340_000 },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "ev-1", title: "학생회 MT", date: 12, month: 7, year: 2026, color: CATEGORY_COLORS.행사비 },
  { id: "ev-2", title: "정기 총회", date: 18, month: 7, year: 2026, color: CATEGORY_COLORS.운영비 },
  { id: "ev-3", title: "신입생 환영회", date: 25, month: 7, year: 2026, color: CATEGORY_COLORS.식비 },
  { id: "ev-4", title: "예산 검토", date: 6, month: 7, year: 2026, color: CATEGORY_COLORS.교통비 },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: "act-1",
    time: "3분 전",
    message: "김밥천국을 식비로 자동 분류했습니다.",
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
    message: "새로운 구성원이 초대되었습니다.",
  },
  {
    id: "act-5",
    time: "Yesterday",
    message: "AI 리포트가 생성되었습니다.",
    hasDogIcon: true,
  },
];

export const AI_CHAT_SUGGESTIONS = [
  "이번 MT 얼마 썼어?",
  "잔액 얼마 남았어?",
  "회칙 위반 거래만 보여줘",
  "식비가 가장 많은 달은?",
];

export const AI_CHAT_RESPONSES: Record<string, string> = {
  "이번 MT 얼마 썼어?": "이번 MT 관련 지출은 ₩850,000이에요. 학생 MT 펜션 예약 건이 검토 대기 중입니다.",
  "잔액 얼마 남았어?": "현재 잔액은 ₩2,680,000이에요. 총 예산의 66%를 사용했습니다.",
  "회칙 위반 거래만 보여줘": "회칙 위반 가능 거래 1건이 있어요. 학생 MT 펜션 ₩850,000 — 공동 승인이 필요합니다.",
  "식비가 가장 많은 달은?": "3월 식비 비중이 가장 높았어요. 이번 달은 37%로 식비가 가장 많습니다.",
};
