export type ReceiptItem = {
  id: string;
  name: string;
  quantity?: number | null;
  unitPrice?: number | null;
  amount?: number | null;
};

/** mock OCR이 파일에서 추출한 결과. category 는 사용자가 직접 채워야 한다(AI 자동분류 없음). */
export type ParsedReceipt = {
  merchant: string;
  purchasedAt: string;
  purchasedTime?: string | null;
  totalAmount: number;
  paymentMethod?: string | null;
  category?: string;
  rawText: string;
  confidence: number;
  items: ReceiptItem[];
};

export type Receipt = ParsedReceipt & {
  id: string;
  groupId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  linkedTransactionId?: string | null;
  createdAt: string;
};

export type MatchCandidate = {
  transactionId: string;
  score: number;
  reasons: string[];
};

export const SUPPORTED_RECEIPT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const MAX_RECEIPT_FILE_SIZE = 10 * 1024 * 1024;

export function validateReceiptFile(file: File): string | null {
  if (!SUPPORTED_RECEIPT_TYPES.includes(file.type)) {
    return "지원하지 않는 파일 형식입니다. JPG, PNG, WEBP, PDF 파일만 업로드할 수 있습니다.";
  }
  if (file.size > MAX_RECEIPT_FILE_SIZE) {
    return "파일 크기는 최대 10MB까지 업로드할 수 있습니다.";
  }
  return null;
}
