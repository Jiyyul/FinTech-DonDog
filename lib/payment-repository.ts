import { getDb } from "@/lib/db";
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

export function seedPaymentsFromJson(rows: PaymentSeedRow[]) {
  const database = getDb();
  database.exec("DELETE FROM audit_reviews; DELETE FROM payment_classifications; DELETE FROM payments;");

  const sorted = [...rows].sort((a, b) => {
    const dateCmp = a.transacted_at.localeCompare(b.transacted_at);
    return dateCmp !== 0 ? dateCmp : a.merchant.localeCompare(b.merchant);
  });

  let balance = INITIAL_ACCOUNT_BALANCE;
  const insert = database.prepare(`
    INSERT INTO payments (merchant, amount, balance_after, transacted_at, payment_method)
    VALUES (@merchant, @amount, @balance_after, @transacted_at, @payment_method)
  `);

  const classify = database.prepare(`
    INSERT INTO payment_classifications (payment_id, category, confidence, source, classified_at)
    VALUES (@paymentId, @category, @confidence, @source, datetime('now'))
  `);

  const insertMany = database.transaction((items: PaymentSeedRow[]) => {
    for (const item of items) {
      balance -= item.amount;
      const result = insert.run({
        merchant: item.merchant,
        amount: item.amount,
        balance_after: balance,
        transacted_at: item.transacted_at,
        payment_method: item.payment_method ?? "학생회 체크카드",
      });

      if (item.category && item.confidence != null) {
        classify.run({
          paymentId: Number(result.lastInsertRowid),
          category: item.category,
          confidence: item.confidence,
          source: "seed",
        });
      }
    }
  });

  insertMany(sorted);
  return sorted.length;
}

export function getAllPayments(): PaymentRecord[] {
  const database = getDb();
  const rows = database
    .prepare(
      `SELECT id, merchant, amount, balance_after, transacted_at, payment_method
       FROM payments
       ORDER BY transacted_at DESC, id DESC`
    )
    .all() as PaymentRow[];

  return rows.map(mapPayment);
}

export function getPaymentCount() {
  const database = getDb();
  const row = database.prepare("SELECT COUNT(*) as count FROM payments").get() as {
    count: number;
  };
  return row.count;
}

export function getAccountBalances() {
  const payments = getAllPayments();
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

export function getClassifications(): PaymentClassificationRow[] {
  const database = getDb();
  const rows = database
    .prepare(
      `SELECT
         pc.payment_id as paymentId,
         p.merchant as merchant,
         pc.category as category,
         pc.confidence as confidence,
         pc.source as source
       FROM payment_classifications pc
       JOIN payments p ON p.id = pc.payment_id
       ORDER BY p.transacted_at DESC, p.id DESC`
    )
    .all() as PaymentClassificationRow[];

  return rows;
}

export function getUnclassifiedPayments(): PaymentRecord[] {
  const database = getDb();
  const rows = database
    .prepare(
      `SELECT p.id, p.merchant, p.amount, p.balance_after, p.transacted_at, p.payment_method
       FROM payments p
       LEFT JOIN payment_classifications pc ON pc.payment_id = p.id
       WHERE pc.payment_id IS NULL
       ORDER BY p.transacted_at DESC, p.id DESC`
    )
    .all() as PaymentRow[];

  return rows.map(mapPayment);
}

export function saveClassifications(
  items: Array<{
    paymentId: number;
    category: BudgetCategory;
    confidence: number;
    source?: string;
  }>
) {
  const database = getDb();
  const upsert = database.prepare(`
    INSERT INTO payment_classifications (payment_id, category, confidence, source, classified_at)
    VALUES (@paymentId, @category, @confidence, @source, datetime('now'))
    ON CONFLICT(payment_id) DO UPDATE SET
      category = excluded.category,
      confidence = excluded.confidence,
      source = excluded.source,
      classified_at = datetime('now')
  `);

  const saveMany = database.transaction(
    (rows: Array<{ paymentId: number; category: BudgetCategory; confidence: number; source?: string }>) => {
      for (const row of rows) {
        upsert.run({
          paymentId: row.paymentId,
          category: row.category,
          confidence: row.confidence,
          source: row.source ?? "openai",
        });
      }
    }
  );

  saveMany(items);
}
