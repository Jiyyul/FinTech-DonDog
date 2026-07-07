import { readFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { closeDb } from "../lib/db";
import { classifyPaymentsWithOpenAI } from "../lib/openai-classify";
import {
  getPaymentCount,
  getUnclassifiedPayments,
  saveClassifications,
} from "../lib/payment-repository";

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

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY가 없습니다.");
    console.error("프로젝트 루트에 .env.local 파일을 만들고 다음을 추가하세요:");
    console.error("OPENAI_API_KEY=sk-...");
    process.exit(1);
  }

  if (getPaymentCount() === 0) {
    console.error("결제 데이터가 없습니다. 먼저 npm run db:seed 를 실행하세요.");
    process.exit(1);
  }

  const unclassified = getUnclassifiedPayments();
  if (unclassified.length === 0) {
    console.log("분류할 결제가 없습니다. 모든 건이 이미 분류되어 있습니다.");
    return;
  }

  console.log(`OpenAI로 ${unclassified.length}건 분류 중... (gpt-4o-mini)`);

  const batchSize = 25;
  for (let i = 0; i < unclassified.length; i += batchSize) {
    const batch = unclassified.slice(i, i + batchSize);
    const results = await classifyPaymentsWithOpenAI(
      batch.map((payment) => ({
        paymentId: payment.id,
        merchant: payment.merchant,
        transactedAt: payment.transactedAt,
      })),
      apiKey
    );

    saveClassifications(
      results.map((item) => ({
        paymentId: item.paymentId,
        category: item.category,
        confidence: item.confidence,
        source: item.source,
      }))
    );

    for (const item of results) {
      console.log(`  ${item.merchant} → ${item.category} (${item.confidence}%)`);
    }
  }

  const versionPath = join(root, "lib", "classification-version.ts");
  writeFileSync(
    versionPath,
    `/** \`npm run classify\` 실행 시 자동 갱신됩니다. */\nexport const CLASSIFICATION_VERSION = "${new Date().toISOString()}";\n`,
    "utf-8"
  );

  console.log(`\nDB 저장 완료: data/dondok.db`);
  console.log("개발 서버를 새로고침하면 대시보드에 반영됩니다.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    closeDb();
  });
