import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { getPaymentCount, seedPaymentsFromJson } from "../lib/payment-repository";
import { seedBudgetDefaults } from "../lib/budget-repository";
import { seedSchedulesIfEmpty } from "../lib/schedule-repository";
import { CALENDAR_EVENTS } from "../lib/build-dashboard-from-payments";
import type { PaymentSeedRow } from "../lib/payment-types";

const root = process.cwd();

function loadEnvFile(filename: string) {
  const path = join(root, filename);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

const seedPath = join(root, "data", "payments.seed.json");

const DEFAULT_TOTAL_BUDGET = 8_000_000;
const DEFAULT_CATEGORY_BUDGETS: Record<string, number> = {
  행사비: 2_500_000,
  식비: 1_500_000,
  운영비: 1_100_000,
  교통비: 900_000,
  장비비: 600_000,
  기타: 400_000,
};

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const force = process.argv.includes("--force");
  const existingCount = await getPaymentCount().catch(() => 0);

  if (!force && existingCount > 0) {
    console.log(`DB가 이미 있습니다 (${existingCount}건). 재시드하려면: npm run db:seed -- --force`);
  } else {
    const rows = JSON.parse(readFileSync(seedPath, "utf-8")) as PaymentSeedRow[];
    const count = await seedPaymentsFromJson(rows);
    console.log(`DB 시드 완료: ${count}건 → Supabase payments 테이블`);
    console.log(`현재 결제 건수: ${await getPaymentCount()}`);
  }

  await seedBudgetDefaults(DEFAULT_TOTAL_BUDGET, DEFAULT_CATEGORY_BUDGETS);
  await seedSchedulesIfEmpty(CALENDAR_EVENTS);

  console.log("");
  console.log("결제 데이터 추가: data/payments.seed.json 수정 후 npm run db:seed -- --force");
  console.log("AI 분류: npm run classify");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
