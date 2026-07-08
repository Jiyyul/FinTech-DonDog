import { detectAnomalies } from "@/lib/anomalies/detect-anomalies";
import type { AnomalyResult } from "@/lib/anomalies/anomaly-types";
import { MOCK_GROUP_SETTINGS, MOCK_SCHEDULES } from "@/lib/group/group-types";
import type { GroupSettings, Schedule } from "@/lib/group/group-types";
import type { ParsedReceipt, Receipt } from "@/lib/receipts/receipt-types";
import type { Transaction } from "@/lib/transactions/transaction-types";

/**
 * 이 파일은 mock 인메모리 저장소다. 실제 서비스로 전환할 때는 아래 함수들의
 * 시그니처를 유지한 채 내부 구현만 Supabase/REST API 호출로 바꾸면 된다.
 */

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// section 10 명세의 거래내역 4건 (그대로 유지) + 시나리오 검증용 추가 거래 2건
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_001",
    groupId: "group_001",
    scheduleId: "schedule_001",
    transactionDate: "2026-03-10",
    transactionTime: "18:30",
    merchant: "김밥천국",
    amount: 42000,
    transactionType: "expense",
    memo: "개강총회 식비",
    category: "식비",
    hasReceipt: false,
  },
  {
    id: "tx_002",
    groupId: "group_001",
    scheduleId: "schedule_002",
    transactionDate: "2026-04-05",
    transactionTime: "14:10",
    merchant: "OO펜션",
    amount: 530000,
    transactionType: "expense",
    memo: "MT 숙소비",
    category: "행사비",
    hasReceipt: false,
  },
  {
    id: "tx_003",
    groupId: "group_001",
    scheduleId: "schedule_002",
    transactionDate: "2026-04-05",
    transactionTime: "14:15",
    merchant: "OO펜션",
    amount: 530000,
    transactionType: "expense",
    memo: "MT 숙소비",
    category: "행사비",
    hasReceipt: false,
  },
  {
    id: "tx_004",
    groupId: "group_001",
    scheduleId: null,
    transactionDate: "2026-05-12",
    transactionTime: "22:30",
    merchant: "스타벅스",
    amount: 128000,
    transactionType: "expense",
    memo: "회의",
    category: "식비",
    hasReceipt: false,
  },
  // 아래 2건은 일정 불일치 / 영수증 보유 케이스 데모를 위해 추가한 테스트 거래
  {
    id: "tx_005",
    groupId: "group_001",
    scheduleId: null,
    transactionDate: "2026-04-12",
    transactionTime: "16:00",
    merchant: "펜션 상회",
    amount: 250000,
    transactionType: "expense",
    memo: "MT 추가 물품",
    category: "행사비",
    hasReceipt: false,
  },
  {
    id: "tx_006",
    groupId: "group_001",
    scheduleId: null,
    transactionDate: "2026-05-20",
    transactionTime: "11:00",
    merchant: "다이소",
    amount: 15000,
    transactionType: "expense",
    memo: "운영 물품",
    category: "운영비",
    hasReceipt: true,
    receiptId: "receipt_seed_001",
  },
];

const MOCK_RECEIPTS: Receipt[] = [
  {
    id: "receipt_seed_001",
    groupId: "group_001",
    merchant: "다이소",
    purchasedAt: "2026-05-20",
    purchasedTime: "11:02",
    totalAmount: 15000,
    paymentMethod: "카드",
    category: "운영비",
    rawText: "다이소\n2026-05-20 11:02\n문구류  x1  3,000\n생활용품  x1  12,000\n합계 금액: 15,000원\n결제수단: 카드",
    confidence: 96,
    items: [
      { id: "seed-item-1", name: "문구류", quantity: 1, unitPrice: 3000, amount: 3000 },
      { id: "seed-item-2", name: "생활용품", quantity: 1, unitPrice: 12000, amount: 12000 },
    ],
    fileName: "다이소_영수증.jpg",
    fileType: "image/jpeg",
    fileSize: 245000,
    linkedTransactionId: "tx_006",
    createdAt: "2026-05-20T11:10:00.000Z",
  },
];

let groupSettingsState: GroupSettings = { ...MOCK_GROUP_SETTINGS };
let schedulesState: Schedule[] = [...MOCK_SCHEDULES];
let transactionsState: Transaction[] = [...MOCK_TRANSACTIONS];
let receiptsState: Receipt[] = [...MOCK_RECEIPTS];
let anomalyResultsCache: AnomalyResult[] = [];

export function getGroupSettings(): GroupSettings {
  return { ...groupSettingsState };
}

export function saveGroupSettings(data: GroupSettings): GroupSettings {
  groupSettingsState = { ...data };
  return getGroupSettings();
}

export function getSchedules(): Schedule[] {
  return [...schedulesState];
}

export function saveSchedule(data: Omit<Schedule, "id"> & { id?: string }): Schedule {
  if (data.id) {
    const id = data.id;
    schedulesState = schedulesState.map((s) => (s.id === id ? { ...s, ...data, id } : s));
    return schedulesState.find((s) => s.id === id)!;
  }
  const created: Schedule = { ...data, id: generateId("schedule") };
  schedulesState = [...schedulesState, created];
  return created;
}

export function getTransactions(): Transaction[] {
  return [...transactionsState];
}

export function updateTransactionReceipt(
  transactionId: string,
  receiptId: string
): Transaction | undefined {
  transactionsState = transactionsState.map((t) =>
    t.id === transactionId ? { ...t, hasReceipt: true, receiptId } : t
  );
  receiptsState = receiptsState.map((r) =>
    r.id === receiptId ? { ...r, linkedTransactionId: transactionId } : r
  );
  return transactionsState.find((t) => t.id === transactionId);
}

export function getReceipts(): Receipt[] {
  return [...receiptsState];
}

export function saveReceipt(
  data: ParsedReceipt & { fileName: string; fileType: string; fileSize: number; groupId?: string }
): Receipt {
  const created: Receipt = {
    ...data,
    id: generateId("receipt"),
    groupId: data.groupId ?? groupSettingsState.id,
    linkedTransactionId: null,
    createdAt: new Date().toISOString(),
  };
  receiptsState = [created, ...receiptsState];
  return created;
}

export function getAnomalies(): AnomalyResult[] {
  anomalyResultsCache = detectAnomalies({
    transactions: getTransactions(),
    schedules: getSchedules(),
    groupSettings: getGroupSettings(),
  });
  return anomalyResultsCache;
}
