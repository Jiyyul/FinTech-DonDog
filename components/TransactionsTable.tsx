"use client";

import { Transaction } from "@/lib/types";
import { BADGE_STYLES } from "@/lib/design-tokens";

const TRANSACTIONS: Transaction[] = [
  { id: "1", vendor: "MT 펜션 예약", category: "행사비", date: "03.18", amount: 450000, status: "approved" },
  { id: "2", vendor: "김밥천국", category: "식비", date: "03.15", amount: 58000, status: "review" },
  { id: "3", vendor: "전자상가 장비대여", category: "운영비", date: "03.11", amount: 120000, status: "approved" },
  { id: "4", vendor: "스타벅스", category: "회의비", date: "03.09", amount: 21000, status: "approved" },
];

const STATUS_LABEL: Record<Transaction["status"], string> = {
  approved: "승인 완료",
  review: "검토 필요",
  violation: "회칙 위반 가능",
};

const STATUS_CLASS: Record<Transaction["status"], string> = {
  approved: BADGE_STYLES.success,
  review: BADGE_STYLES.warning,
  violation: BADGE_STYLES.danger,
};

export default function TransactionsTable() {
  return (
    <div className="rounded-card border border-hairline bg-card p-5.5 shadow-card">
      <h3 className="mb-4 text-sm font-semibold text-navy">최근 거래내역</h3>
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            {["거래처", "AI 분류", "날짜", "금액", "상태"].map((h) => (
              <th
                key={h}
                className="border-b border-hairline pb-2.5 text-left text-[11px] font-semibold text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TRANSACTIONS.map((t) => (
            <tr
              key={t.id}
              className={`transition-colors hover:bg-appbg ${
                t.status === "review" ? "bg-warning/5" : ""
              }`}
            >
              <td className="border-b border-hairline py-3 text-ink2 first:rounded-l-lg first:pl-2.5">
                {t.vendor}
              </td>
              <td className="border-b border-hairline py-3 text-ink2">{t.category}</td>
              <td className="border-b border-hairline py-3 text-ink2">{t.date}</td>
              <td className="border-b border-hairline py-3 font-medium text-navy">
                ₩{t.amount.toLocaleString()}
              </td>
              <td className="border-b border-hairline py-3 last:rounded-r-lg last:pr-2.5">
                <span
                  className={`inline-flex h-7 items-center rounded-full px-3 text-[11px] font-semibold ${STATUS_CLASS[t.status]}`}
                >
                  {STATUS_LABEL[t.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
