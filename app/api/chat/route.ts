import { NextResponse } from "next/server";
import { getDashboardData, type DashboardData } from "@/lib/get-dashboard-data";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

function buildFinancialContext(data: DashboardData): string {
  const categoryTotals = data.budgetSlices
    .map((s) => `${s.category} ₩${s.amount.toLocaleString()} (${s.percent}%)`)
    .join(", ");

  const recentTransactions = data.allTransactions
    .slice(0, 80)
    .map(
      (t) =>
        `${t.date} | ${t.merchant} | ₩${t.amount.toLocaleString()} | ${t.category} | ${t.status}`
    )
    .join("\n");

  const anomalies = data.anomalyQueue
    .map((a) => `${a.transaction.merchant} ₩${a.transaction.amount.toLocaleString()} - ${a.reason}`)
    .join("\n");

  return `
[예산 현황]
총 예산: ₩${data.budgetTotal.toLocaleString()}
사용액: ₩${data.budgetUsed.toLocaleString()} (${data.budgetUsagePercent}%)
남은 예산: ₩${data.budgetRemaining.toLocaleString()}
카테고리별 사용액: ${categoryTotals}

[현재 계좌 잔액]
₩${data.currentAccountBalance.toLocaleString()}

[검토 필요 / 이상 거래]
${anomalies || "없음"}

[최근 거래 내역]
${recentTransactions || "없음"}
`.trim();
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      message: "🐶 OpenAI API 키가 설정되어 있지 않아요. 관리자에게 문의해 주세요.",
    });
  }

  const body = (await req.json().catch(() => null)) as
    | { message?: string; history?: ChatMessage[] }
    | null;
  const userMessage = body?.message?.trim();

  if (!userMessage) {
    return NextResponse.json({ error: "메시지를 입력해 주세요." }, { status: 400 });
  }

  const dashboardData = await getDashboardData();
  const context = buildFinancialContext(dashboardData);

  const history = (body?.history ?? [])
    .slice(-6)
    .map((m) => ({ role: m.role, content: m.content }));

  const messages = [
    {
      role: "system" as const,
      content: `당신은 "Don Dog"(돈독)이라는 대학 동아리/학생회 회계 AI 비서입니다.
아래 실제 회계 데이터를 근거로 질문에 답하세요.
답변은 친절하고 신뢰감 있는 존댓말로, 문장 앞에 강아지 이모지(🐶)를 붙여 간결하게 작성하세요.
데이터에 없는 내용은 추측하지 말고 모른다고 답하세요.
금액은 항상 ₩와 천 단위 콤마를 사용해 표기하세요.

${context}`,
    },
    ...history,
    { role: "user" as const, content: userMessage },
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({
      message: "🐶 지금은 답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.",
    });
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  const answer =
    data.choices[0]?.message?.content?.trim() ??
    "🐶 요청하신 내용을 확인했어요. 관련 거래를 대시보드에서 검토해 보세요.";

  return NextResponse.json({ message: answer });
}
