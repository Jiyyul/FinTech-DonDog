export type OcrScanResult = {
  rawText: string;
  confidence: number;
};

type ReceiptTemplate = {
  merchant: string;
  items: { name: string; unitPrice: number }[];
  paymentMethod: string;
};

/** 실제 서비스에서는 OCR API가 반환할 법한 값들을 흉내내기 위한 샘플 영수증 모음 */
const RECEIPT_TEMPLATES: ReceiptTemplate[] = [
  {
    merchant: "김밥천국",
    items: [
      { name: "김밥", unitPrice: 4000 },
      { name: "라면", unitPrice: 5000 },
      { name: "돈까스", unitPrice: 8000 },
    ],
    paymentMethod: "카드",
  },
  {
    merchant: "스타벅스",
    items: [
      { name: "아메리카노", unitPrice: 4500 },
      { name: "카페라떼", unitPrice: 5000 },
      { name: "샌드위치", unitPrice: 6500 },
    ],
    paymentMethod: "카드",
  },
  {
    merchant: "OO펜션",
    items: [
      { name: "숙박비", unitPrice: 380000 },
      { name: "바베큐 대여료", unitPrice: 75000 },
    ],
    paymentMethod: "계좌이체",
  },
  {
    merchant: "다이소",
    items: [
      { name: "문구류", unitPrice: 3000 },
      { name: "생활용품", unitPrice: 5000 },
    ],
    paymentMethod: "현금",
  },
  {
    merchant: "이마트",
    items: [
      { name: "생수", unitPrice: 2000 },
      { name: "간식", unitPrice: 12000 },
      { name: "휴지", unitPrice: 9000 },
    ],
    paymentMethod: "카드",
  },
];

function hashSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function formatDateForReceipt(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * 실제 서비스에서는 이 함수를 외부 OCR API(Clova OCR, Google Vision 등) 호출로 교체한다.
 * 지금은 업로드된 파일명/크기를 시드로 사용해 그럴듯한 영수증 원문을 생성하는 mock이며,
 * 실제 이미지 내용은 읽지 않는다.
 */
export async function runMockOcr(file: File): Promise<OcrScanResult> {
  await new Promise((resolve) => setTimeout(resolve, 1100));

  const seed = hashSeed(`${file.name}-${file.size}`);
  const template = RECEIPT_TEMPLATES[seed % RECEIPT_TEMPLATES.length];
  const confidence = 70 + (seed % 28); // 70 ~ 97

  const qtyFor = (index: number) => 1 + ((seed >> (index + 2)) % 3);
  const lines = template.items.map((item, index) => {
    const qty = qtyFor(index);
    const amount = qty * item.unitPrice;
    return `${item.name}  x${qty}  ${amount.toLocaleString("ko-KR")}`;
  });
  const total = template.items.reduce((sum, item, index) => sum + qtyFor(index) * item.unitPrice, 0);

  const purchasedAt = formatDateForReceipt(new Date());
  const hh = String(9 + (seed % 12)).padStart(2, "0");
  const mm = String((seed * 7) % 60).padStart(2, "0");

  const rawText = [
    template.merchant,
    `${purchasedAt} ${hh}:${mm}`,
    "------------------------------",
    ...lines,
    "------------------------------",
    `합계 금액: ${total.toLocaleString("ko-KR")}원`,
    `결제수단: ${template.paymentMethod}`,
  ].join("\n");

  return { rawText, confidence };
}
