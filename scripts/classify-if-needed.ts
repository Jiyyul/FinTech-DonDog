import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { getDemoGroupId } from "../lib/auth-repository";
import { runPaymentClassification } from "../lib/run-payment-classification";
import { getUnclassifiedPayments } from "../lib/payment-repository";

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

function isAutoClassifyEnabled() {
  const flag = process.env.AUTO_CLASSIFY?.trim().toLowerCase();
  if (flag === "0" || flag === "false" || flag === "off" || flag === "no") {
    return false;
  }
  return true;
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  if (!isAutoClassifyEnabled()) {
    console.log("AUTO_CLASSIFY=off — 자동 분류를 건너뜁니다.");
    return;
  }

  const demoGroupId = await getDemoGroupId();
  const pending = (await getUnclassifiedPayments(demoGroupId)).length;
  if (pending === 0) {
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log(
      `미분류 결제 ${pending}건이 있지만 OPENAI_API_KEY가 없어 자동 분류를 건너뜁니다.`
    );
    console.log(".env.local에 OPENAI_API_KEY를 설정하거나 npm run classify를 실행하세요.");
    return;
  }

  console.log(`[auto-classify] 미분류 ${pending}건 감지 — 분류를 시작합니다.`);

  const result = await runPaymentClassification({ apiKey, rootDir: root, groupId: demoGroupId });
  console.log(`[auto-classify] ${result.message}`);
}

main().catch((err) => {
  console.error("[auto-classify] 분류 중 오류:", err);
  process.exit(1);
});
