export type GroupSettings = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  year: number;
  semester: string;
  accountNumberMasked: string;
  initialAmount: number;
  anomalyThresholdAmount: number;
  ruleText?: string;
  ruleFileName?: string | null;
};

export type Schedule = {
  id: string;
  groupId: string;
  title: string;
  scheduleDate: string;
  expectedBudget: number;
  expectedCategory: string;
  description?: string;
};

/** 원본 계좌번호를 화면 표시용으로 마스킹한다. 이미 마스킹된 값은 그대로 반환. */
export function maskAccountNumber(raw: string): string {
  if (raw.includes("*")) return raw;
  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length < 6) return raw;
  const bank = digits.slice(0, 3);
  const last = digits.slice(-6);
  return `${bank}-***-${last}`;
}

export const MOCK_GROUP_SETTINGS: GroupSettings = {
  id: "group_001",
  name: "AI 핀테크 동아리",
  startDate: "2026-03-01",
  endDate: "2026-08-31",
  year: 2026,
  semester: "1학기",
  accountNumberMasked: "110-***-123456",
  initialAmount: 1_000_000,
  anomalyThresholdAmount: 100_000,
  ruleText: "10만원 이상 지출은 영수증을 첨부해야 한다.",
  ruleFileName: null,
};

export const MOCK_SCHEDULES: Schedule[] = [
  {
    id: "schedule_001",
    groupId: "group_001",
    title: "개강총회",
    scheduleDate: "2026-03-10",
    expectedBudget: 150_000,
    expectedCategory: "식비",
    description: "개강총회 식사",
  },
  {
    id: "schedule_002",
    groupId: "group_001",
    title: "MT",
    scheduleDate: "2026-04-05",
    expectedBudget: 500_000,
    expectedCategory: "행사비",
    description: "MT 숙소 및 행사비",
  },
];
