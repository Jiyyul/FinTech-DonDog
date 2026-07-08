import {
  AlertCircle,
  Bot,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  FileSearch,
  FileSpreadsheet,
  Link2,
  Receipt,
  ScanLine,
  ShieldAlert,
  Sparkles,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
};

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Step = {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
};

export type Testimonial = {
  rating: number;
  school: string;
  club: string;
  quote: string;
};

export type PricingPlan = import("@/lib/plans").Plan;

export { PLANS_LIST as PRICING_PLANS } from "@/lib/plans";

export const LANDING_NAV_LINKS: NavLink[] = [
  { label: "기능", href: "#features" },
  { label: "사용방법", href: "#how-it-works" },
  { label: "요금제", href: "#pricing" },
  { label: "고객센터", href: "#support" },
  { label: "블로그", href: "#blog" },
];

export const FEATURES: Feature[] = [
  {
    icon: Bot,
    title: "AI 자동 분류",
    description:
      "계좌·카드 거래를 AI가 실시간으로 분류하고, 카테고리와 일정을 자동 연결합니다.",
  },
  {
    icon: Receipt,
    title: "OCR 영수증 매칭",
    description:
      "영수증을 업로드하면 OCR로 금액·가맹점을 추출하고 거래와 자동 매칭합니다.",
  },
  {
    icon: ShieldAlert,
    title: "이상거래 감지",
    description:
      "평소 패턴과 다른 지출을 AI가 탐지하고, 검토·승인 워크플로를 제공합니다.",
  },
  {
    icon: Eye,
    title: "실시간 회계 공개",
    description:
      "동아리원 누구나 최신 회계 현황을 투명하게 확인할 수 있습니다.",
  },
  {
    icon: Wallet,
    title: "예산 관리",
    description:
      "학기·행사별 예산을 설정하고 사용률과 잔액을 한눈에 파악합니다.",
  },
  {
    icon: FileSearch,
    title: "감사 리포트",
    description:
      "AI가 회계 데이터를 분석해 요약 리포트와 인사이트를 자동 생성합니다.",
  },
];

export const STEPS: Step[] = [
  {
    number: 1,
    icon: Users,
    title: "동아리 생성",
    description: "학교와 동아리 정보를 입력하고 팀원을 초대합니다.",
  },
  {
    number: 2,
    icon: Link2,
    title: "계좌 연결",
    description: "동아리 계좌와 카드를 안전하게 연결합니다.",
  },
  {
    number: 3,
    icon: Sparkles,
    title: "AI 자동 분류",
    description: "거래가 들어오면 AI가 카테고리와 일정을 분류합니다.",
  },
  {
    number: 4,
    icon: CreditCard,
    title: "검토 및 승인",
    description: "이상거래와 미매칭 항목을 검토하고 승인합니다.",
  },
  {
    number: 5,
    icon: Eye,
    title: "실시간 공유",
    description: "승인된 회계가 동아리원에게 실시간으로 공개됩니다.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    rating: 5,
    school: "서울대학교",
    club: "경영학회",
    quote:
      "엑셀 정산에서 벗어나니 회의 시간이 절반으로 줄었어요. AI 분류가 정말 정확합니다.",
  },
  {
    rating: 5,
    school: "연세대학교",
    club: "컴퓨터동아리",
    quote:
      "이상거래 알림 덕분에 실수로 중복 결제된 걸 바로 잡을 수 있었습니다. 신뢰가 쌓였어요.",
  },
  {
    rating: 5,
    school: "고려대학교",
    club: "밴드동아리",
    quote:
      "동아리원들이 실시간으로 회계를 볼 수 있어 투명성 문제가 완전히 해결됐습니다.",
  },
];

export type ComparisonItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type ComparisonPanel = {
  label: string;
  items: ComparisonItem[];
  metric: { label: string; value: string };
};

export const BEFORE_PANEL: ComparisonPanel = {
  label: "기존 방식",
  metric: { label: "평균 소요 시간", value: "월 8시간+" },
  items: [
    {
      icon: FileSpreadsheet,
      title: "엑셀 수기 관리",
      description: "매달 장부를 직접 작성하고 셀을 하나씩 채웁니다.",
    },
    {
      icon: AlertCircle,
      title: "수기 입력 오류",
      description: "누락·중복 입력으로 정산 실수가 자주 발생합니다.",
    },
    {
      icon: EyeOff,
      title: "투명성 부족",
      description: "동아리원이 회계 현황을 실시간으로 확인하기 어렵습니다.",
    },
    {
      icon: Clock,
      title: "정산 어려움",
      description: "학기말 정산에 며칠씩 소요되는 경우가 많습니다.",
    },
  ],
};

export const AFTER_PANEL: ComparisonPanel = {
  label: "돈독 사용",
  metric: { label: "업무 효율", value: "70% 시간 절약" },
  items: [
    {
      icon: Bot,
      title: "AI 자동 회계",
      description: "거래가 들어오면 AI가 카테고리와 일정을 자동 분류합니다.",
    },
    {
      icon: ScanLine,
      title: "OCR 자동 입력",
      description: "영수증 업로드만으로 금액·가맹점이 자동 추출됩니다.",
    },
    {
      icon: Eye,
      title: "실시간 공개",
      description: "승인된 회계가 동아리원에게 즉시 공개됩니다.",
    },
    {
      icon: ShieldAlert,
      title: "이상거래 감지",
      description: "비정상 지출을 AI가 탐지하고 알려드립니다.",
    },
  ],
};
