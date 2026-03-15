function safeNumber(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return value
}

export function formatCurrency(value: number): string {
  const n = safeNumber(value)
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

export function formatCurrencyFull(value: number): string {
  const n = safeNumber(value)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}
