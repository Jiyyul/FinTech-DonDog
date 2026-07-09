/**
 * OCR 원문(rawText)에서 가맹점명/날짜/시간/금액/결제수단/품목을 추출한다.
 * 이름은 receipt-types.ts 의 ParsedReceipt 와 충돌을 피하기 위해
 * ParsedReceiptFields 로 export 한다.
 */
export type ReceiptItemField = {
  name: string;
  quantity?: number;
  unitPrice?: number;
  amount?: number;
};

export type ParsedReceiptFields = {
  merchant: string;
  date: string;
  time?: string;
  amount: number;
  paymentMethod?: string;
  rawText: string;
  items?: ReceiptItemField[];
};

const HANGUL_RE = /[가-힣]/;

const MERCHANT_EXCLUDE_PATTERNS = [
  /주소/,
  /전화/,
  /TEL/i,
  /사업자\s*(등록)?\s*번호/,
  /대표자?\s*[:：]/,
  /영수증/,
  /카드\s*번호/,
  /승인\s*번호/,
  /가맹점\s*번호/,
  /POS/i,
  /No\.?\s*\d/i,
  /^[-=*_\s]+$/,
];

const MERCHANT_LABEL_RE = /상호명?\s*[:：]\s*(.+)/;

/** "상호명:" / "상호:" 라벨 뒤에 오는 값을 우선으로 상호명을 인식한다. */
function extractMerchantByLabel(lines: string[]): string | null {
  for (const line of lines) {
    const match = line.match(MERCHANT_LABEL_RE);
    const value = match?.[1]?.trim();
    if (value) return value;
  }
  return null;
}

/**
 * OCR이 이미지 상단의 로고/장식을 깨진 글자로 잘못 읽는 경우가 많아
 * ("IZE | | 저" 같은 잡음), 한글이 한 글자만 섞여 있어도 통과하던 기존 필터로는
 * 이런 잡음 줄을 걸러내지 못했다. 실제 상호명은 보통 한글 단어(2글자 이상 연속)로
 * 이루어지므로, 파이프 문자가 섞였거나 한글 글자 수가 너무 적은 줄은 잡음으로 보고 건너뛴다.
 */
function looksLikeOcrNoise(line: string): boolean {
  if (line.includes("|")) return true;
  const hangulCount = (line.match(/[가-힣]/g) ?? []).length;
  return hangulCount < 2;
}

/** 상호명 라벨이 없는 영수증을 위한 대체 로직: 맨 위 한글 줄을 상호명으로 추정한다. */
function extractMerchantFallback(lines: string[]): string {
  for (const line of lines) {
    if (!HANGUL_RE.test(line)) continue;
    if (looksLikeOcrNoise(line)) continue;
    if (MERCHANT_EXCLUDE_PATTERNS.some((re) => re.test(line))) continue;
    if (/\d{2,4}[-.\/]\d{1,2}[-.\/]\d{1,2}/.test(line)) continue;
    if (/\d{4}년\s*\d{1,2}월/.test(line)) continue;
    if (/\d{1,2}:\d{2}/.test(line)) continue;
    if (/원\s*$/.test(line) && /[\d,]{3,}/.test(line)) continue;
    return line;
  }
  return "알 수 없음";
}

function extractMerchant(lines: string[]): string {
  return extractMerchantByLabel(lines) ?? extractMerchantFallback(lines);
}

function extractDate(text: string): string {
  const isoMatch = text.match(/(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const korMatch = text.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (korMatch) {
    const [, y, m, d] = korMatch;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return "";
}

function extractTime(text: string): string | undefined {
  const match = text.match(/(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (!match) return undefined;
  const [, h, m] = match;
  return `${h.padStart(2, "0")}:${m}`;
}

const AMOUNT_KEYWORDS = [
  "총 결제금액",
  "총결제금액",
  "결제금액",
  "승인금액",
  "합계금액",
  "총액",
  "합계",
  "금액",
];

function parseNumber(text: string): number {
  const digits = text.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function extractAmount(lines: string[], fullText: string): number {
  for (const keyword of AMOUNT_KEYWORDS) {
    const line = lines.find((l) => l.includes(keyword));
    if (!line) continue;
    const numbers = line.match(/[\d][\d,]*/g);
    if (numbers && numbers.length > 0) {
      const value = parseNumber(numbers[numbers.length - 1]);
      if (value > 0) return value;
    }
  }

  // 키워드로 못 찾으면 콤마가 포함된 금액 형태 후보 중 가장 큰 값을 사용한다.
  const candidates = fullText.match(/[\d]{1,3}(?:,\d{3})+/g) ?? [];
  const values = candidates.map(parseNumber).filter((v) => v > 0);
  if (values.length > 0) return Math.max(...values);
  return 0;
}

const PAYMENT_KEYWORDS = ["신용카드", "체크카드", "계좌이체", "현금", "카드"];

function extractPaymentMethod(text: string): string | undefined {
  for (const keyword of PAYMENT_KEYWORDS) {
    if (text.includes(keyword)) return keyword;
  }
  return undefined;
}

const ITEM_LINE_RE = /^(.+?)\s+x\s*(\d+)\s+([\d,]+)\s*원?$/;

function extractItems(lines: string[]): ReceiptItemField[] {
  const items: ReceiptItemField[] = [];
  for (const line of lines) {
    const match = line.match(ITEM_LINE_RE);
    if (!match) continue;
    const [, name, qtyText, amountText] = match;
    const quantity = Number(qtyText);
    const amount = parseNumber(amountText);
    items.push({
      name: name.trim(),
      quantity,
      unitPrice: quantity > 0 ? Math.round(amount / quantity) : amount,
      amount,
    });
  }
  return items;
}

export function parseReceiptText(rawText: string): ParsedReceiptFields {
  const lines = rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    merchant: extractMerchant(lines),
    date: extractDate(rawText),
    time: extractTime(rawText),
    amount: extractAmount(lines, rawText),
    paymentMethod: extractPaymentMethod(rawText),
    rawText,
    items: extractItems(lines),
  };
}
