import { readFileSync } from "fs";
import { join } from "path";
import { closeDb, resetDb } from "../lib/db";
import { getPaymentCount, seedPaymentsFromJson } from "../lib/payment-repository";
import type { PaymentSeedRow } from "../lib/payment-types";

const root = process.cwd();
const seedPath = join(root, "data", "payments.seed.json");

function main() {
  const force = process.argv.includes("--force");
  const existingCount = (() => {
    try {
      return getPaymentCount();
    } catch {
      return 0;
    }
  })();

  if (!force && existingCount > 0) {
    console.log(`DB가 이미 있습니다 (${existingCount}건). 재시드하려면: npm run db:seed -- --force`);
    return;
  }

  const rows = JSON.parse(readFileSync(seedPath, "utf-8")) as PaymentSeedRow[];
  resetDb();
  const count = seedPaymentsFromJson(rows);

  console.log(`DB 시드 완료: ${count}건 → data/dondok.db`);
  console.log(`현재 결제 건수: ${getPaymentCount()}`);
  console.log("");
  console.log("결제 데이터 추가: data/payments.seed.json 수정 후 npm run db:seed");
  console.log("AI 분류: npm run classify");
}

main();
closeDb();
