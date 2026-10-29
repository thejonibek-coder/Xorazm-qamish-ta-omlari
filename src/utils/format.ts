export function formatPrice(amount: number): string {
  return `${amount.toLocaleString('uz-UZ')} so'm`;
}

export function formatShortPrice(amount: number): string {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1)}K`;
  }
  return amount.toString();
}
