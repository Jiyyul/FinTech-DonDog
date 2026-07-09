import { getSupabase } from "@/lib/supabase";
import type { PaymentClassificationRow, PaymentRecord, PaymentSeedRow } from "@/lib/payment-types";
import type { BudgetCategory } from "@/lib/dashboard-types";

const INITIAL_ACCOUNT_BALANCE = 2_500_000;

type PaymentRow = {
  id: number;
  merchant: string;
  amount: number;
  balance_after: number;
  transacted_at: string;
  payment_method: string;
};

function mapPayment(row: PaymentRow): PaymentRecord {
  return {
    id: row.id,
    merchant: row.merchant,
    amount: row.amount,
    balance: row.balance_after,
    transactedAt: row.transacted_at,
    paymentMethod: row.payment_method,
  };
}

export async function seedPaymentsFromJson(rows: PaymentSeedRow[]): Promise<number> {
  const db = getSupabase();

  await db.from("payment_classifications").delete().neq("payment_id", -1);
  await db.from("transaction_reviews").delete().neq("payment_id", -1);
  await db.from("payments").delete().neq("id", -1);

  const sorted = [...rows].sort((a, b) => {
    const dateCmp = a.transacted_at.localeCompare(b.transacted_at);
    return dateCmp !== 0 ? dateCmp : a.merchant.localeCompare(b.merchant);
  });

  let balance = INITIAL_ACCOUNT_BALANCE;
  const insertRows = sorted.map((item) => {
    balance -= item.amount;
    return {
      merchant: item.merchant,
      amount: item.amount,
      balance_after: balance,
      transacted_at: item.transacted_at,
      payment_method: item.payment_method ?? "학생회 체크카드",
    };
  });

  const { error } = await db.from("payments").insert(insertRows);
  if (error) throw new Error(`결제 시드 실패: ${error.message}`);

  return insertRows.length;
}

/**
 * 영수증만 있고 연결할 기존 거래가 없을 때, 새 거래(payment) 행을 만든다.
 * balance_after는 정확한 시계열 재계산 대신 현재 잔액 기준 근사치를 사용한다 (mock 데이터 한계).
 */
export async function createPayment(data: {
  merchant: string;
  amount: number;
  transactedAt: string;
  paymentMethod?: string;
}): Promise<PaymentRecord> {
  const db = getSupabase();
  const { current } = await getAccountBalances();
  const balanceAfter = current - data.amount;

  const { data: inserted, error } = await db
    .from("payments")
    .insert({
      merchant: data.merchant,
      amount: data.amount,
      balance_after: balanceAfter,
      transacted_at: data.transactedAt,
      payment_method: data.paymentMethod ?? "학생회 체크카드",
    })
    .select("id, merchant, amount, balance_after, transacted_at, payment_method")
    .single();

  if (error) throw new Error(`거래 생성 실패: ${error.message}`);
  return mapPayment(inserted as PaymentRow);
}

/**
 * 거래처/금액/날짜를 직접 수정한다. balance_after는 createPayment와 마찬가지로
 * 재계산하지 않는다 (mock 데이터 한계로 시계열 재계산은 범위 밖).
 */
export async function updatePayment(
  id: number,
  patch: { merchant?: string; amount?: number; transactedAt?: string }
): Promise<PaymentRecord> {
  const db = getSupabase();
  const { data: updated, error } = await db
    .from("payments")
    .update({
      ...(patch.merchant !== undefined ? { merchant: patch.merchant } : {}),
      ...(patch.amount !== undefined ? { amount: patch.amount } : {}),
      ...(patch.transactedAt !== undefined ? { transacted_at: patch.transactedAt } : {}),
    })
    .eq("id", id)
    .select("id, merchant, amount, balance_after, transacted_at, payment_method")
    .single();

  if (error) throw new Error(`거래 수정 실패: ${error.message}`);
  return mapPayment(updated as PaymentRow);
}

export async function getAllPayments(): Promise<PaymentRecord[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("payments")
    .select("id, merchant, amount, balance_after, transacted_at, payment_method")
    .order("transacted_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(`결제 조회 실패: ${error.message}`);
  return (data as PaymentRow[]).map(mapPayment);
}

export async function getPaymentCount(): Promise<number> {
  const db = getSupabase();
  const { count, error } = await db.from("payments").select("id", { count: "exact", head: true });
  if (error) throw new Error(`결제 건수 조회 실패: ${error.message}`);
  return count ?? 0;
}

export async function getAccountBalances(): Promise<{ initial: number; current: number }> {
  const payments = await getAllPayments();
  if (payments.length === 0) {
    return {
      initial: INITIAL_ACCOUNT_BALANCE,
      current: INITIAL_ACCOUNT_BALANCE,
    };
  }

  const oldest = payments[payments.length - 1];
  return {
    initial: oldest.balance + oldest.amount,
    current: payments[0].balance,
  };
}

export async function getClassifications(): Promise<PaymentClassificationRow[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("payment_classifications")
    .select("payment_id, category, confidence, source, payments!inner(merchant, transacted_at)")
    .order("classified_at", { ascending: false });

  if (error) throw new Error(`분류 조회 실패: ${error.message}`);

  return (data as unknown as Array<{
    payment_id: number;
    category: BudgetCategory;
    confidence: number;
    source: string;
    payments: { merchant: string; transacted_at: string };
  }>).map((row) => ({
    paymentId: row.payment_id,
    merchant: row.payments.merchant,
    category: row.category,
    confidence: row.confidence,
    source: row.source,
  }));
}

export async function getUnclassifiedPayments(): Promise<PaymentRecord[]> {
  const db = getSupabase();
  const { data: classified, error: classifiedError } = await db
    .from("payment_classifications")
    .select("payment_id");
  if (classifiedError) throw new Error(`분류 조회 실패: ${classifiedError.message}`);

  const classifiedIds = (classified ?? []).map((r) => r.payment_id);

  let query = db
    .from("payments")
    .select("id, merchant, amount, balance_after, transacted_at, payment_method")
    .order("transacted_at", { ascending: false })
    .order("id", { ascending: false });

  if (classifiedIds.length > 0) {
    query = query.not("id", "in", `(${classifiedIds.join(",")})`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`미분류 결제 조회 실패: ${error.message}`);
  return (data as PaymentRow[]).map(mapPayment);
}

export async function saveClassifications(
  items: Array<{
    paymentId: number;
    category: BudgetCategory;
    confidence: number;
    source?: string;
  }>
): Promise<void> {
  if (items.length === 0) return;
  const db = getSupabase();

  const rows = items.map((row) => ({
    payment_id: row.paymentId,
    category: row.category,
    confidence: row.confidence,
    source: row.source ?? "openai",
    classified_at: new Date().toISOString(),
  }));

  const { error } = await db.from("payment_classifications").upsert(rows, { onConflict: "payment_id" });
  if (error) throw new Error(`분류 저장 실패: ${error.message}`);
}
