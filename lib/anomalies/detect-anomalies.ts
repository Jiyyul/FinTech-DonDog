import { formatCurrency } from "@/lib/format";
import type { GroupSettings, Schedule } from "@/lib/group/group-types";
import { daysBetween, isSimilarMerchant } from "@/lib/matching-utils";
import { resolveCategory, type Transaction } from "@/lib/transactions/transaction-types";
import type { AnomalyResult } from "@/lib/anomalies/anomaly-types";

const SCHEDULE_MATCH_WINDOW_DAYS = 30;
const SCHEDULE_DATE_TOLERANCE_DAYS = 3;
const DUPLICATE_DATE_TOLERANCE_DAYS = 1;
const DUPLICATE_AMOUNT_TOLERANCE = 100;

type DetectAnomaliesInput = {
  transactions: Transaction[];
  schedules: Schedule[];
  groupSettings: GroupSettings;
};

/**
 * 명시적으로 연결된 일정이 없으면, 같은(해석된) 카테고리를 가진 일정 중
 * 날짜가 가장 가까운 것을 "추정 연관 일정"으로 사용해 일정 불일치를 판단한다.
 * 순수 규칙 기반 매칭이며 AI 분류가 아니다 — 카테고리는 거래에 있는 값만 비교한다.
 */
function findRelatedSchedule(tx: Transaction, schedules: Schedule[]): Schedule | undefined {
  if (tx.scheduleId) {
    return schedules.find((s) => s.id === tx.scheduleId);
  }

  const category = resolveCategory(tx.category);
  let closest: Schedule | undefined;
  let closestDiff = Infinity;

  for (const schedule of schedules) {
    if (resolveCategory(schedule.expectedCategory) !== category) continue;
    const diff = daysBetween(tx.transactionDate, schedule.scheduleDate);
    if (diff <= SCHEDULE_MATCH_WINDOW_DAYS && diff < closestDiff) {
      closest = schedule;
      closestDiff = diff;
    }
  }

  return closest;
}

export function detectAnomalies({
  transactions,
  schedules,
  groupSettings,
}: DetectAnomaliesInput): AnomalyResult[] {
  const results: AnomalyResult[] = [];
  const expenses = transactions.filter((t) => t.transactionType === "expense");

  // 5-1a. 초기 총 금액 기준 예산 초과 (누적 지출이 기준을 넘긴 시점부터 이후 거래에 표시)
  const orderedByDate = [...expenses].sort((a, b) =>
    a.transactionDate < b.transactionDate ? -1 : a.transactionDate > b.transactionDate ? 1 : 0
  );
  let runningTotal = 0;
  for (const tx of orderedByDate) {
    runningTotal += tx.amount;
    if (runningTotal > groupSettings.initialAmount) {
      results.push({
        transactionId: tx.id,
        type: "BUDGET_EXCEEDED",
        severity: "high",
        title: "초기 총 금액 예산 초과",
        description: `누적 지출이 초기 총 금액(${formatCurrency(
          groupSettings.initialAmount
        )})을 초과했습니다. 이 거래까지 누적 지출은 ${formatCurrency(runningTotal)}입니다.`,
        reasons: [
          `초기 총 금액: ${formatCurrency(groupSettings.initialAmount)}`,
          `누적 지출(이 거래 포함): ${formatCurrency(runningTotal)}`,
        ],
      });
    }
  }

  // 5-1b. 일정별 예상 예산 초과 (명시적으로 scheduleId 가 연결된 거래만 합산)
  for (const schedule of schedules) {
    const linked = expenses.filter((t) => t.scheduleId === schedule.id);
    if (linked.length === 0) continue;
    const total = linked.reduce((sum, t) => sum + t.amount, 0);
    if (total > schedule.expectedBudget) {
      for (const tx of linked) {
        results.push({
          transactionId: tx.id,
          type: "BUDGET_EXCEEDED",
          severity: "medium",
          title: `"${schedule.title}" 일정 예산 초과`,
          description: `"${schedule.title}" 일정의 예상 예산(${formatCurrency(
            schedule.expectedBudget
          )})을 초과하는 지출(${formatCurrency(total)})이 발생했습니다.`,
          reasons: [
            `일정 예상 예산: ${formatCurrency(schedule.expectedBudget)}`,
            `연결된 지출 합계: ${formatCurrency(total)}`,
          ],
        });
      }
    }
  }

  // 5-2. 고액 지출
  for (const tx of expenses) {
    if (tx.amount > groupSettings.anomalyThresholdAmount) {
      const ratio = tx.amount / groupSettings.anomalyThresholdAmount;
      results.push({
        transactionId: tx.id,
        type: "HIGH_AMOUNT",
        severity: ratio >= 2 ? "high" : "medium",
        title: "고액 지출",
        description: `이상감지 기준금액(${formatCurrency(
          groupSettings.anomalyThresholdAmount
        )})을 초과하는 지출입니다.`,
        reasons: [
          `거래 금액: ${formatCurrency(tx.amount)}`,
          `이상감지 기준금액: ${formatCurrency(groupSettings.anomalyThresholdAmount)}`,
        ],
      });
    }
  }

  // 5-3. 중복 결제 의심
  for (let i = 0; i < expenses.length; i++) {
    for (let j = i + 1; j < expenses.length; j++) {
      const a = expenses[i];
      const b = expenses[j];
      const sameAmount = Math.abs(a.amount - b.amount) <= DUPLICATE_AMOUNT_TOLERANCE;
      const sameDate = daysBetween(a.transactionDate, b.transactionDate) <= DUPLICATE_DATE_TOLERANCE_DAYS;
      const sameMerchant = isSimilarMerchant(a.merchant, b.merchant);
      const sameCategory = resolveCategory(a.category) === resolveCategory(b.category);

      if (sameAmount && sameDate && sameMerchant && sameCategory) {
        for (const [tx, other] of [
          [a, b],
          [b, a],
        ] as const) {
          results.push({
            transactionId: tx.id,
            type: "DUPLICATE_PAYMENT",
            severity: "high",
            title: "중복 결제 의심",
            description: `${other.transactionDate} ${other.merchant} ${formatCurrency(
              other.amount
            )} 거래와 조건이 유사하여 중복 결제가 의심됩니다.`,
            reasons: [
              "날짜가 1일 이내로 가깝습니다.",
              "금액 차이가 100원 이내입니다.",
              "가맹점명이 동일하거나 유사합니다.",
              "카테고리가 동일합니다.",
            ],
          });
        }
      }
    }
  }

  // 5-4. 일정과 다른 결제 감지
  for (const tx of expenses) {
    const schedule = findRelatedSchedule(tx, schedules);
    if (!schedule) continue;

    const category = resolveCategory(tx.category);
    const expectedCategory = resolveCategory(schedule.expectedCategory);
    const dateDiff = daysBetween(tx.transactionDate, schedule.scheduleDate);
    const reasons: string[] = [];

    if (category !== expectedCategory) {
      reasons.push(
        `일정 예상 카테고리(${expectedCategory})와 거래 카테고리(${category})가 다릅니다.`
      );
    }
    if (dateDiff > SCHEDULE_DATE_TOLERANCE_DAYS) {
      reasons.push(
        `일정 날짜(${schedule.scheduleDate})와 거래 날짜(${tx.transactionDate})가 ${Math.round(
          dateDiff
        )}일 차이납니다.`
      );
    }

    if (reasons.length > 0) {
      results.push({
        transactionId: tx.id,
        type: "SCHEDULE_MISMATCH",
        severity: "medium",
        title: `"${schedule.title}" 일정과 다른 결제`,
        description: `"${schedule.title}" 일정과 날짜 또는 카테고리가 일치하지 않는 결제로 의심됩니다.`,
        reasons,
      });
    }
  }

  // 5-5. 영수증 미등록 거래 (고액 지출 또는 다른 이상거래로 감지되었는데 영수증이 없는 경우)
  const anomalousIds = new Set(results.map((r) => r.transactionId));
  for (const tx of expenses) {
    const isHighAmount = tx.amount > groupSettings.anomalyThresholdAmount;
    const isOtherAnomaly = anomalousIds.has(tx.id);
    if ((isHighAmount || isOtherAnomaly) && !tx.hasReceipt) {
      results.push({
        transactionId: tx.id,
        type: "RECEIPT_REQUIRED",
        severity: "low",
        title: "영수증 확인 필요",
        description: "고액 지출 또는 이상거래로 감지되었으나 영수증이 등록되지 않았습니다.",
        reasons: ["영수증 미등록"],
      });
    }
  }

  return results;
}
