import { getSupabase } from "@/lib/supabase";
import { paymentIdToTransactionId, transactionIdToPaymentId } from "@/lib/payment-types";
import { createPayment, saveClassifications } from "@/lib/payment-repository";
import { normalizeReceiptCategory } from "@/lib/receipt-category";
import type { ParsedReceipt, Receipt, ReceiptItem } from "@/lib/receipts/receipt-types";

const GROUP_ID = "group_001";

type ReceiptRow = {
  id: string;
  group_id: string;
  merchant: string;
  purchased_at: string;
  purchased_time: string | null;
  total_amount: number;
  payment_method: string | null;
  category: string | null;
  raw_text: string | null;
  confidence: number | null;
  items: ReceiptItem[];
  file_name: string;
  file_type: string;
  file_size: number;
  image_data_url: string | null;
  linked_payment_id: number | null;
  created_at: string;
};

function mapReceipt(row: ReceiptRow): Receipt {
  return {
    id: row.id,
    groupId: row.group_id,
    merchant: row.merchant,
    purchasedAt: row.purchased_at,
    purchasedTime: row.purchased_time,
    totalAmount: row.total_amount,
    paymentMethod: row.payment_method,
    category: row.category ?? undefined,
    rawText: row.raw_text ?? "",
    confidence: row.confidence ?? 0,
    items: row.items ?? [],
    fileName: row.file_name,
    fileType: row.file_type,
    fileSize: row.file_size,
    imageDataUrl: row.image_data_url,
    linkedTransactionId:
      row.linked_payment_id != null ? paymentIdToTransactionId(row.linked_payment_id) : null,
    createdAt: row.created_at,
  };
}

export async function getReceipts(): Promise<Receipt[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("receipts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(`영수증 조회 실패: ${error.message}`);
  return (data as ReceiptRow[]).map(mapReceipt);
}

/** payment_id -> true (영수증이 연결된 결제 id 집합). hasReceipt 계산에 사용. */
export async function getLinkedPaymentIds(): Promise<Set<number>> {
  const db = getSupabase();
  const { data, error } = await db.from("receipts").select("linked_payment_id");
  if (error) throw new Error(`영수증 연결 조회 실패: ${error.message}`);

  return new Set(
    (data ?? [])
      .map((row) => row.linked_payment_id)
      .filter((id): id is number => id != null)
  );
}

export async function saveReceipt(
  data: ParsedReceipt & {
    fileName: string;
    fileType: string;
    fileSize: number;
    imageDataUrl?: string | null;
    linkedTransactionId?: string | null;
  }
): Promise<Receipt> {
  const db = getSupabase();
  let linkedPaymentId = data.linkedTransactionId
    ? transactionIdToPaymentId(data.linkedTransactionId)
    : null;

  // 연결할 기존 거래가 없으면 OCR로 읽은 값으로 새 거래(payment) 행을 만들어 연결한다.
  const createdNewPayment = linkedPaymentId == null;
  if (createdNewPayment) {
    const payment = await createPayment({
      merchant: data.merchant,
      amount: data.totalAmount,
      transactedAt: data.purchasedAt,
      paymentMethod: data.paymentMethod ?? undefined,
    });
    linkedPaymentId = payment.id;
    await saveClassifications([
      {
        paymentId: payment.id,
        category: normalizeReceiptCategory(data.category),
        confidence: data.confidence ?? 90,
        source: "receipt",
      },
    ]);
  }

  const id = `receipt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const { data: inserted, error } = await db
    .from("receipts")
    .insert({
      id,
      group_id: GROUP_ID,
      merchant: data.merchant,
      purchased_at: data.purchasedAt,
      purchased_time: data.purchasedTime,
      total_amount: data.totalAmount,
      payment_method: data.paymentMethod,
      category: data.category,
      raw_text: data.rawText,
      confidence: data.confidence,
      items: data.items,
      file_name: data.fileName,
      file_type: data.fileType,
      file_size: data.fileSize,
      image_data_url: data.imageDataUrl ?? null,
      linked_payment_id: linkedPaymentId,
    })
    .select("*")
    .single();

  if (error) throw new Error(`영수증 저장 실패: ${error.message}`);
  return mapReceipt(inserted as ReceiptRow);
}

/**
 * 이미 저장됐지만 거래에 연결되지 않은 영수증을, 영수증 자체의 OCR 정보(거래처/날짜/금액)로
 * 새 거래(payment) 행을 만들어 그 거래로 등록한다. 영수증 사진을 어딘가에 "붙이는" 것과는
 * 다르게, 인식된 정보 자체가 하나의 거래내역이 되는 것이 목적이다.
 */
export async function convertReceiptToPayment(receiptId: string): Promise<Receipt> {
  const db = getSupabase();
  const { data: row, error: fetchError } = await db
    .from("receipts")
    .select("*")
    .eq("id", receiptId)
    .single();
  if (fetchError) throw new Error(`영수증 조회 실패: ${fetchError.message}`);

  const receipt = mapReceipt(row as ReceiptRow);
  if (receipt.linkedTransactionId) return receipt;

  const payment = await createPayment({
    merchant: receipt.merchant,
    amount: receipt.totalAmount,
    transactedAt: receipt.purchasedAt,
    paymentMethod: receipt.paymentMethod ?? undefined,
  });

  const { data: updated, error } = await db
    .from("receipts")
    .update({ linked_payment_id: payment.id })
    .eq("id", receiptId)
    .select("*")
    .single();

  if (error) throw new Error(`영수증-거래 연결 실패: ${error.message}`);
  return mapReceipt(updated as ReceiptRow);
}

export async function updateReceipt(
  receiptId: string,
  patch: { merchant?: string; purchasedAt?: string; totalAmount?: number }
): Promise<Receipt> {
  const db = getSupabase();
  const { data: updated, error } = await db
    .from("receipts")
    .update({
      ...(patch.merchant !== undefined ? { merchant: patch.merchant } : {}),
      ...(patch.purchasedAt !== undefined ? { purchased_at: patch.purchasedAt } : {}),
      ...(patch.totalAmount !== undefined ? { total_amount: patch.totalAmount } : {}),
    })
    .eq("id", receiptId)
    .select("*")
    .single();

  if (error) throw new Error(`영수증 수정 실패: ${error.message}`);
  return mapReceipt(updated as ReceiptRow);
}
