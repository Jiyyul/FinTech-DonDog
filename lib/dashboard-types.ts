export type TransactionStatus = "completed" | "pending" | "review";

export type BudgetCategory =
  | "행사비"
  | "식비"
  | "운영비"
  | "교통비"
  | "장소대여비"
  | "장비비"
  | "홍보비"
  | "기타";

export type BudgetTrendFilter = "전체" | BudgetCategory;

export type AnomalyType =
  | "schedule_mismatch"
  | "amount_threshold"
  | "low_confidence"
  | "rule_violation"
  | "duplicate_payment"
  | "receipt_required";

export type DashboardTransaction = {
  id: string;
  merchant: string;
  category: BudgetCategory;
  date: string;
  dateLabel: string;
  amount: number;
  balance: number;
  status: TransactionStatus;
  paymentMethod?: string;
  transactionId?: string;
  hasReceipt?: boolean;
  aiConfidence?: number;
};

export type AuditAnomaly = {
  id: string;
  type: AnomalyType;
  transaction: DashboardTransaction;
  reason: string;
  relatedSchedule?: string;
  relatedScheduleId?: string;
  ruleReference?: string;
  deferred?: boolean;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: number;
  month: number;
  year: number;
  color: string;
  description?: string;
};

export type ActivityIcon = "check" | "calendar" | "clock" | "user" | "file";

export type ActivityItem = {
  id: string;
  time: string;
  message: string;
  hasDogIcon?: boolean;
  icon?: ActivityIcon;
};

export type BudgetCategorySlice = {
  category: BudgetCategory;
  percent: number;
  amount: number;
  color: string;
};

export type MonthlyBudgetPoint = {
  month: string;
  used: number;
  budget: number;
  balance: number;
  changeRate?: number | null;
};

export type AIReportSummary = {
  confidence: number;
  lines: string[];
  totalMoM: number | null;
  foodMoM: number | null;
  eventMoM: number | null;
  opsMoM: number | null;
  trafficMoM: number | null;
  overBudgetItems: string[];
  ruleViolations: number;
  coApprovalRequired: number;
  anomalyCount: number;
  recommendations: string[];
};

export const ANOMALY_TYPE_LABELS: Record<AnomalyType, string> = {
  schedule_mismatch: "일정 불일치",
  amount_threshold: "고액 결제",
  low_confidence: "카테고리 확인 필요",
  rule_violation: "회칙 위반 가능",
  duplicate_payment: "중복 결제",
  receipt_required: "영수증 필요",
};
