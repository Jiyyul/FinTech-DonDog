import type { BudgetCategory } from "@/lib/dashboard-types";

export type PaymentToClassify = {
  paymentId: number;
  merchant: string;
  transactedAt: string;
};

export type PaymentClassificationResult = {
  paymentId: number;
  merchant: string;
  category: BudgetCategory;
  confidence: number;
  source: "openai";
};

export const OPENAI_CLASSIFY_CATEGORIES: BudgetCategory[] = [
  "식비",
  "교통비",
  "장소대여비",
  "운영비",
  "행사비",
  "장비비",
  "홍보비",
  "기타",
];

const CATEGORY_GUIDE = `
- 식비: 음식·음료·카페·회식·간식
- 교통비: 택시·버스·지하철·KTX·주차·유류비
- 장소대여비: 호텔·펜션·MT 숙소·회의실·연회장 대관
- 운영비: 서버·클라우드·인쇄·도메인·사무용품·정기 구독
- 행사비: 해커톤·대회·시상·행사 진행·참가비
- 장비비: 노트북·전자기기·촬영·음향 장비 구매
- 홍보비: 배너·포스터·SNS 광고·홍보물 제작
- 기타: 위 카테고리에 명확히 해당하지 않는 경우
`.trim();

type RawClassification = {
  paymentId?: number;
  payment_id?: number;
  merchant: string;
  category: BudgetCategory;
  confidence: number;
};

function parseClassifications(
  text: string,
  payments: PaymentToClassify[]
): PaymentClassificationResult[] {
  const parsedJson = JSON.parse(text) as
    | RawClassification[]
    | { classifications?: RawClassification[]; items?: RawClassification[] };

  const parsed = Array.isArray(parsedJson)
    ? parsedJson
    : parsedJson.classifications ?? parsedJson.items ?? [];

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("OpenAI 응답에서 분류 결과를 찾을 수 없습니다.");
  }

  const byPaymentId = new Map<number, RawClassification>();
  for (const item of parsed) {
    const paymentId = item.paymentId ?? item.payment_id;
    if (paymentId != null) {
      byPaymentId.set(paymentId, item);
    }
  }

  return payments.map((payment) => {
    const found = byPaymentId.get(payment.paymentId);
    if (!found) {
      throw new Error(`OpenAI 분류 결과에 paymentId ${payment.paymentId}가 없습니다.`);
    }

    const category = OPENAI_CLASSIFY_CATEGORIES.includes(found.category)
      ? found.category
      : "기타";

    return {
      paymentId: payment.paymentId,
      merchant: payment.merchant,
      category,
      confidence: Math.min(100, Math.max(0, Math.round(found.confidence))),
      source: "openai" as const,
    };
  });
}

export async function classifyPaymentsWithOpenAI(
  payments: PaymentToClassify[],
  apiKey: string
): Promise<PaymentClassificationResult[]> {
  const prompt = `당신은 대학 동아리·학생회 회계 담당자입니다.
아래 결제 내역 각각을 회계 카테고리 하나로 분류하세요.

사용 가능한 카테고리: ${OPENAI_CLASSIFY_CATEGORIES.join(", ")}

카테고리 설명:
${CATEGORY_GUIDE}

결제 내역:
${payments
  .map(
    (p, i) =>
      `${i + 1}. paymentId=${p.paymentId}, 결제처="${p.merchant}", 날짜=${p.transactedAt}`
  )
  .join("\n")}

반드시 JSON 객체만 반환하세요. 다른 설명은 쓰지 마세요.
형식: {"classifications":[{"paymentId":1,"merchant":"결제처명","category":"카테고리","confidence":0-100}]}
각 paymentId를 그대로 유지하세요.
confidence는 분류 확신도(0~100)입니다.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "동아리 회계 결제를 카테고리로 분류합니다. 요청된 JSON 객체만 반환합니다.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API 오류: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  const text = data.choices[0]?.message?.content ?? "";
  return parseClassifications(text, payments);
}
