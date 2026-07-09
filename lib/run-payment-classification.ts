import { writeFileSync } from "fs";
import { join } from "path";
import { getDemoGroupId } from "@/lib/auth-repository";
import { classifyPaymentsWithOpenAI } from "@/lib/openai-classify";
import {
  getPaymentCount,
  getUnclassifiedPayments,
  saveClassifications,
} from "@/lib/payment-repository";

const BATCH_SIZE = 25;

export type ClassificationRunResult = {
  ran: boolean;
  classifiedCount: number;
  message: string;
};

export async function runPaymentClassification(options: {
  apiKey: string;
  rootDir?: string;
  log?: (line: string) => void;
  groupId?: number;
}): Promise<ClassificationRunResult> {
  const log = options.log ?? console.log;
  const root = options.rootDir ?? process.cwd();
  const groupId = options.groupId ?? (await getDemoGroupId());

  if ((await getPaymentCount(groupId)) === 0) {
    return {
      ran: false,
      classifiedCount: 0,
      message: "결제 데이터가 없습니다.",
    };
  }

  const unclassified = await getUnclassifiedPayments(groupId);
  if (unclassified.length === 0) {
    return {
      ran: false,
      classifiedCount: 0,
      message: "분류할 결제가 없습니다.",
    };
  }

  log(`OpenAI로 ${unclassified.length}건 분류 중... (gpt-4o-mini)`);

  let classifiedCount = 0;
  for (let i = 0; i < unclassified.length; i += BATCH_SIZE) {
    const batch = unclassified.slice(i, i + BATCH_SIZE);
    const results = await classifyPaymentsWithOpenAI(
      batch.map((payment) => ({
        paymentId: payment.id,
        merchant: payment.merchant,
        transactedAt: payment.transactedAt,
      })),
      options.apiKey
    );

    await saveClassifications(
      results.map((item) => ({
        paymentId: item.paymentId,
        category: item.category,
        confidence: item.confidence,
        source: item.source,
      }))
    );

    classifiedCount += results.length;
    for (const item of results) {
      log(`  ${item.merchant} → ${item.category} (${item.confidence}%)`);
    }
  }

  const versionPath = join(root, "lib", "classification-version.ts");
  writeFileSync(
    versionPath,
    `/** 분류 실행 시 자동 갱신됩니다. */\nexport const CLASSIFICATION_VERSION = "${new Date().toISOString()}";\n`,
    "utf-8"
  );

  return {
    ran: true,
    classifiedCount,
    message: `DB 저장 완료: ${classifiedCount}건 분류됨`,
  };
}
