import { runOcr } from "@/lib/receipts/ocr-provider";
import { parseReceiptText } from "@/lib/receipts/parse-receipt-text";
import type { ParsedReceipt, ReceiptItem } from "@/lib/receipts/receipt-types";

/**
 * 업로드된 파일을 실제 OCR(tesseract.js)로 읽고 정형 데이터로 변환한다.
 * category 는 절대 추론하지 않고 undefined 로 남겨 사용자가 직접 선택하도록 한다
 * (AI 분류 기능 제외 방침). OCR 자체가 실패하면 예외를 던지며, 호출부에서
 * 사용자가 직접 입력할 수 있는 빈 폼으로 대체 처리해야 한다.
 */
export async function parseReceipt(file: File): Promise<ParsedReceipt> {
  const { rawText, confidence } = await runOcr(file);
  const fields = parseReceiptText(rawText);

  const items: ReceiptItem[] = (fields.items ?? []).map((item, index) => ({
    id: `item-${index}-${Date.now()}`,
    name: item.name,
    quantity: item.quantity ?? null,
    unitPrice: item.unitPrice ?? null,
    amount: item.amount ?? null,
  }));

  return {
    merchant: fields.merchant,
    purchasedAt: fields.date,
    purchasedTime: fields.time ?? null,
    totalAmount: fields.amount,
    paymentMethod: fields.paymentMethod ?? null,
    category: undefined,
    rawText,
    confidence,
    items,
  };
}
