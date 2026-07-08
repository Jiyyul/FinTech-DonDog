export function formatCurrency(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export function formatPercent(value: number): string {
  return `${value}%`;
}
