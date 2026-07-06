export type TransactionStatus = "completed" | "pending" | "review";

export type BudgetCategory =
  | "행사비"
  | "식비"
  | "운영비"
  | "교통비"
  | "장비비"
  | "홍보비"
  | "기타";

export type DashboardTransaction = {
  id: string;
  merchant: string;
  category: BudgetCategory;
  date: string;
  dateLabel: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod?: string;
  transactionId?: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: number;
  month: number;
  year: number;
  color: string;
};

export type ActivityItem = {
  id: string;
  time: string;
  message: string;
  hasDogIcon?: boolean;
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
};
