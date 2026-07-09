import { getServerSession } from "@/lib/auth-server";
import { getDashboardData } from "@/lib/get-dashboard-data";

export const runtime = "nodejs";

const STATUS_LABELS: Record<string, string> = {
  completed: "완료",
  pending: "대기",
  review: "검토 필요",
};

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const session = getServerSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await getDashboardData(session.groupId);

  const header = ["날짜", "결제처", "카테고리", "금액", "상태", "결제수단", "영수증", "거래번호"];
  const rows = data.allTransactions.map((tx) => [
    tx.date,
    tx.merchant,
    tx.category,
    String(tx.amount),
    STATUS_LABELS[tx.status] ?? tx.status,
    tx.paymentMethod ?? "-",
    tx.hasReceipt ? "예" : "아니오",
    tx.transactionId ?? "-",
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\r\n");

  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="dondog-ledger-${data.allTransactions[0]?.date ?? "export"}.csv"`,
    },
  });
}
