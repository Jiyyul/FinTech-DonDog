import { getSupabase } from "@/lib/supabase";
import { getBudgetTotal } from "@/lib/budget-repository";
import type { PaymentClassificationRow, PaymentRecord, PaymentSeedRow } from "@/lib/payment-types";
import type { BudgetCategory } from "@/lib/dashboard-types";

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

export async function seedPaymentsFromJson(
  rows: PaymentSeedRow[],
  groupId: number
): Promise<number> {
  const db = getSupabase();
  const initialBalance = await getBudgetTotal(groupId);

  const { data: existingPayments } = await db
    .from("payments")
    .select("id")
    .eq("group_id", groupId);

  const paymentIds = (existingPayments ?? []).map((row) => row.id);
  if (paymentIds.length > 0) {
    await db.from("payment_classifications").delete().in("payment_id", paymentIds);
    await db.from("transaction_reviews").delete().in("payment_id", paymentIds);
    await db.from("payments").delete().eq("group_id", groupId);
  }

  const sorted = [...rows].sort((a, b) => {
    const dateCmp = a.transacted_at.localeCompare(b.transacted_at);
    return dateCmp !== 0 ? dateCmp : a.merchant.localeCompare(b.merchant);
  });

  let balance = initialBalance || 2_500_000;
  const insertRows = sorted.map((item) => {
    balance -= item.amount;
    return {
      group_id: groupId,
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
 */
export async function createPayment(
  groupId: number,
  data: {
    merchant: string;
    amount: number;
    transactedAt: string;
    paymentMethod?: string;
  }
): Promise<PaymentRecord> {
  const db = getSupabase();
  const { current } = await getAccountBalances(groupId);
  const balanceAfter = current - data.amount;

  const { data: inserted, error } = await db
    .from("payments")
    .insert({
      group_id: groupId,
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

export async function getAllPayments(groupId: number): Promise<PaymentRecord[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("payments")
    .select("id, merchant, amount, balance_after, transacted_at, payment_method")
    .eq("group_id", groupId)
    .order("transacted_at", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw new Error(`결제 조회 실패: ${error.message}`);
  return (data as PaymentRow[]).map(mapPayment);
}

export async function getPaymentCount(groupId?: number): Promise<number> {
  const db = getSupabase();
  let query = db.from("payments").select("id", { count: "exact", head: true });
  if (groupId != null) {
    query = query.eq("group_id", groupId);
  }
  const { count, error } = await query;
  if (error) throw new Error(`결제 건수 조회 실패: ${error.message}`);
  return count ?? 0;
}

export async function getAccountBalances(
  groupId: number
): Promise<{ initial: number; current: number }> {
  const payments = await getAllPayments(groupId);
  const totalBudget = await getBudgetTotal(groupId);

  if (payments.length === 0) {
    return { initial: totalBudget, current: totalBudget };
  }

  const oldest = payments[payments.length - 1];
  return {
    initial: oldest.balance + oldest.amount,
    current: payments[0].balance,
  };
}

export async function getClassifications(groupId: number): Promise<PaymentClassificationRow[]> {
  const db = getSupabase();
  const { data, error } = await db
    .from("payment_classifications")
    .select("payment_id, category, confidence, source, payments!inner(merchant, transacted_at, group_id)")
    .eq("payments.group_id", groupId)
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

export async function getUnclassifiedPayments(groupId?: number): Promise<PaymentRecord[]> {
  const db = getSupabase();

  let classifiedIds: number[] = [];
  if (groupId != null) {
    const { data: payments } = await db.from("payments").select("id").eq("group_id", groupId);
    const paymentIds = (payments ?? []).map((row) => row.id);
    if (paymentIds.length === 0) {
      return [];
    }
    const { data: classified, error: classifiedError } = await db
      .from("payment_classifications")
      .select("payment_id")
      .in("payment_id", paymentIds);
    if (classifiedError) throw new Error(`분류 조회 실패: ${classifiedError.message}`);
    classifiedIds = (classified ?? []).map((row) => row.payment_id);
  } else {
    const { data: classified, error: classifiedError } = await db
      .from("payment_classifications")
      .select("payment_id");
    if (classifiedError) throw new Error(`분류 조회 실패: ${classifiedError.message}`);
    classifiedIds = (classified ?? []).map((row) => row.payment_id);
  }

  let query = db
    .from("payments")
    .select("id, merchant, amount, balance_after, transacted_at, payment_method")
    .order("transacted_at", { ascending: false })
    .order("id", { ascending: false });

  if (groupId != null) {
    query = query.eq("group_id", groupId);
  }
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
