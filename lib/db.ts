import Database from "better-sqlite3";
import { existsSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const DB_PATH = join(DATA_DIR, "dondok.db");

let db: Database.Database | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  transacted_at TEXT NOT NULL,
  payment_method TEXT NOT NULL DEFAULT '학생회 체크카드',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_payments_transacted_at ON payments(transacted_at DESC, id DESC);

CREATE TABLE IF NOT EXISTS payment_classifications (
  payment_id INTEGER PRIMARY KEY,
  category TEXT NOT NULL,
  confidence INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'openai',
  classified_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS audit_reviews (
  payment_id INTEGER NOT NULL,
  anomaly_type TEXT NOT NULL,
  review_status TEXT NOT NULL,
  category_override TEXT,
  related_schedule_id TEXT,
  related_schedule_title TEXT,
  reviewed_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (payment_id, anomaly_type),
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS budget_settings (
  category TEXT PRIMARY KEY,
  budget_amount INTEGER NOT NULL
);
`;

export function getDbPath() {
  return DB_PATH;
}

export function getDb() {
  if (!db) {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    db.exec(SCHEMA);
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

export function resetDb() {
  closeDb();
  if (existsSync(DB_PATH)) {
    unlinkSync(DB_PATH);
  }
  return getDb();
}
