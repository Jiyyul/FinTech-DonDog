export type AuthRole = "accountant" | "member";

export type GroupSummary = {
  id: number;
  name: string;
  entryCode: string;
};

export type AuthSession = {
  role: AuthRole;
  groupId: number;
  groupName: string;
  entryCode: string;
  userId?: number;
  username?: string;
  /** 회계 담당자가 소속된 그룹 목록 (활성 그룹은 groupId) */
  groups?: GroupSummary[];
};

export type AccountantRecord = {
  id: number;
  username: string;
  accountNumber: string;
  phone: string;
  affiliation?: string;
  groupId: number;
};

export type GroupRecord = {
  id: number;
  name: string;
  entryCode: string;
};

export type SignupInput = {
  username: string;
  password: string;
  accountNumber: string;
  phone: string;
  affiliation?: string;
  groupName: string;
  totalBudget: number;
};
