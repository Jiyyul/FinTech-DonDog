export type Organization = {
  id: string;
  name: string;
  semester: string;
};

export type RegisteredCard = {
  id: string;
  label: string;
  last4: string;
  issuer: string;
};

export type UserProfile = {
  name: string;
  birthDate: string;
  userId: string;
  role: string;
  initials: string;
  card: RegisteredCard;
};

export const CURRENT_ORGANIZATION: Organization = {
  id: "org-1",
  name: "컴퓨터공학과 학생회",
  semester: "2026년 1학기",
};

export const ORGANIZATIONS: Organization[] = [
  CURRENT_ORGANIZATION,
  { id: "org-2", name: "프로그래밍 동아리", semester: "2026년 1학기" },
  { id: "org-3", name: "AI 학회", semester: "2025년 2학기" },
];

export const CURRENT_USER: UserProfile = {
  name: "윤지영",
  birthDate: "2002.03.15",
  userId: "jiyoung.yoon",
  role: "총무",
  initials: "지영",
  card: {
    id: "card-1",
    label: "학생회 체크카드",
    last4: "4821",
    issuer: "국민은행",
  },
};
