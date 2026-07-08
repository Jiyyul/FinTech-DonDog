/** 이상감지/영수증 매칭에서 공통으로 쓰는 날짜·문자열 비교 유틸 */

export function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA).getTime();
  const b = new Date(dateB).getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return Infinity;
  return Math.abs(a - b) / (1000 * 60 * 60 * 24);
}

function normalizeMerchant(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "");
}

export function isSimilarMerchant(a: string, b: string): boolean {
  const na = normalizeMerchant(a);
  const nb = normalizeMerchant(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}
