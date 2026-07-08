import { daysBetween, isSimilarMerchant } from "@/lib/matching-utils";
import type { MatchCandidate, ParsedReceipt } from "@/lib/receipts/receipt-types";
import { resolveCategory, type Transaction } from "@/lib/transactions/transaction-types";

const AMOUNT_TOLERANCE = 100;
const DATE_TOLERANCE_DAYS = 3;
const MIN_MATCHED_CRITERIA = 2;

const SCORE_WEIGHTS = {
  amount: 40,
  date: 27,
  merchant: 25,
  category: 8,
};

/**
 * 영수증과 기존 거래를 비교해 매칭 후보를 계산한다.
 * 최종 연결은 자동으로 하지 않고, 점수/사유가 높은 순으로 사용자에게 선택지를 제공한다.
 */
export function matchReceiptToTransactions(
  receipt: ParsedReceipt,
  transactions: Transaction[]
): MatchCandidate[] {
  const candidates: MatchCandidate[] = [];

  for (const tx of transactions) {
    if (tx.transactionType !== "expense") continue;

    const reasons: string[] = [];
    let score = 0;
    let matchCount = 0;

    if (Math.abs(receipt.totalAmount - tx.amount) <= AMOUNT_TOLERANCE) {
      reasons.push("금액이 일치합니다.");
      score += SCORE_WEIGHTS.amount;
      matchCount++;
    }

    const dateDiff = daysBetween(receipt.purchasedAt, tx.transactionDate);
    if (dateDiff <= DATE_TOLERANCE_DAYS) {
      reasons.push(dateDiff === 0 ? "결제일이 같습니다." : "결제일이 비슷합니다.");
      score += SCORE_WEIGHTS.date;
      matchCount++;
    }

    if (isSimilarMerchant(receipt.merchant, tx.merchant)) {
      reasons.push("가맹점명이 유사합니다.");
      score += SCORE_WEIGHTS.merchant;
      matchCount++;
    }

    if (receipt.category && resolveCategory(receipt.category) === resolveCategory(tx.category)) {
      reasons.push("카테고리가 같습니다.");
      score += SCORE_WEIGHTS.category;
      matchCount++;
    }

    if (matchCount >= MIN_MATCHED_CRITERIA) {
      candidates.push({
        transactionId: tx.id,
        score: Math.min(100, score),
        reasons,
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score);
}
