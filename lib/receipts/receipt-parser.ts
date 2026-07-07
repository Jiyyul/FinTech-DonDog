import { runMockOcr } from "@/lib/receipts/ocr-provider";
import type { ParsedReceipt, ReceiptItem } from "@/lib/receipts/receipt-types";

function parseAmount(text: string): number {
  const digits = text.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

function extractItems(lines: string[]): ReceiptItem[] {
  const itemPattern = /^(.+?)\s+x(\d+)\s+([\d,]+)$/;
  const items: ReceiptItem[] = [];

  lines.forEach((line, index) => {
    const match = line.trim().match(itemPattern);
    if (!match) return;
    const [, name, qtyText, amountText] = match;
    const quantity = Number(qtyText);
    const amount = parseAmount(amountText);
    items.push({
      id: `item-${index}-${Date.now()}`,
      name: name.trim(),
      quantity,
      unitPrice: quantity > 0 ? Math.round(amount / quantity) : amount,
      amount,
    });
  });

  return items;
}

/**
 * OCR 원문(rawText)을 정형 데이터로 변환한다. category 는 절대 추론하지 않고
 * undefined 로 남겨 사용자가 직접 선택하도록 한다 (AI 분류 기능 제외 방침).
 */
export async function parseReceipt(file: File): Promise<ParsedReceipt> {
  const { rawText, confidence } = await runMockOcr(file);
  const lines = rawText.split("\n");

  const merchant = lines[0]?.trim() || "알 수 없음";
  const dateTimeLine = lines[1] ?? "";
  const dateMatch = dateTimeLine.match(/(\d{4}-\d{2}-\d{2})/);
  const timeMatch = dateTimeLine.match(/(\d{2}:\d{2})/);

  const totalLine = lines.find((line) => line.includes("합계"));
  const totalMatch = totalLine?.match(/([\d,]+)\s*원/);

  const paymentLine = lines.find((line) => line.includes("결제수단"));
  const paymentMethod = paymentLine?.split(":")[1]?.trim();

  const items = extractItems(lines);
  const itemsTotal = items.reduce((sum, item) => sum + (item.amount ?? 0), 0);

  return {
    merchant,
    purchasedAt: dateMatch?.[1] ?? new Date().toISOString().slice(0, 10),
    purchasedTime: timeMatch?.[1] ?? null,
    totalAmount: totalMatch ? parseAmount(totalMatch[1]) : itemsTotal,
    paymentMethod: paymentMethod ?? null,
    category: undefined,
    rawText,
    confidence,
    items,
  };
}
