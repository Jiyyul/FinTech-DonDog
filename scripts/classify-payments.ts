import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { closeDb } from "../lib/db";
import { runPaymentClassification } from "../lib/run-payment-classification";

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

  const result = await runPaymentClassification({ apiKey, rootDir: root });
  console.log(result.message);

  if (result.ran) {
    console.log("개발 서버를 새로고침하면 대시보드에 반영됩니다.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    closeDb();
  });
