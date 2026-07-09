export type AuthRole = "accountant" | "member";

export type AuthSession = {
  role: AuthRole;
  groupId: number;
  groupName: string;
  entryCode: string;
  userId?: number;
  username?: string;
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
