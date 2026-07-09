import { getSupabase } from "@/lib/supabase";
import { paymentIdToTransactionId, transactionIdToPaymentId } from "@/lib/payment-types";
import type { ParsedReceipt, Receipt, ReceiptItem } from "@/lib/receipts/receipt-types";

type ReceiptRow = {
  id: string;
  group_id: number;
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
  linked_payment_id: number | null;
  created_at: string;
};

function mapReceipt(row: ReceiptRow): Receipt {
  return {
    id: row.id,
    groupId: String(row.group_id),
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
    linkedTransactionId:
      row.linked_payment_id != null ? paymentIdToTransactionId(row.linked_payment_id) : null,
    createdAt: row.created_at,
  };
}

export async function getReceipts(groupId: number): Promise<Receipt[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("receipts")
    .select("*")
    .eq("group_id", groupId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`영수증 조회 실패: ${error.message}`);
  return (data as ReceiptRow[]).map(mapReceipt);
}

export async function getLinkedPaymentIds(groupId: number): Promise<Set<number>> {
  const db = getSupabase();
  const { data, error } = await db
    .from("receipts")
    .select("linked_payment_id")
    .eq("group_id", groupId);

  if (error) throw new Error(`영수증 연결 조회 실패: ${error.message}`);

  return new Set(
    (data ?? [])
      .map((row) => row.linked_payment_id)
      .filter((id): id is number => id != null)
  );
}

export async function saveReceipt(
  groupId: number,
  data: ParsedReceipt & {
    fileName: string;
    fileType: string;
    fileSize: number;
    linkedTransactionId?: string | null;
  }
): Promise<Receipt> {
  const db = getSupabase();
  const linkedPaymentId = data.linkedTransactionId
    ? transactionIdToPaymentId(data.linkedTransactionId)
    : null;

  const id = `receipt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const { data: inserted, error } = await db
    .from("receipts")
    .insert({
      id,
      group_id: groupId,
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
      linked_payment_id: linkedPaymentId,
    })
    .select("*")
    .single();

  if (error) throw new Error(`영수증 저장 실패: ${error.message}`);
  return mapReceipt(inserted as ReceiptRow);
}
