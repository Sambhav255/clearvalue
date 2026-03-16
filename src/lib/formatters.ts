import type { CurrencyCode } from '../types'

/** Approximate USD to other currency rates (display only). Update periodically for accuracy. */
const USD_TO_CURRENCY: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
}

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
}

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
}

function safeNumber(value: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return value
}

/** Convert USD amount to display currency (model stays in USD). */
export function toDisplayCurrency(amountUsd: number, currency: CurrencyCode): number {
  return safeNumber(amountUsd) * USD_TO_CURRENCY[currency]
}

export function formatCurrency(
  value: number,
  currency: CurrencyCode = 'USD'
): string {
  const n = safeNumber(value)
  const display = currency === 'USD' ? n : toDisplayCurrency(n, currency)
  const prefix = getCurrencyPrefix(currency)
  if (display >= 1_000_000) return `${prefix}${(display / 1_000_000).toFixed(1)}M`
  if (display >= 1_000) return `${prefix}${(display / 1_000).toFixed(0)}K`
  return `${prefix}${display.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

/** Format with currency symbol and locale (e.g. $1,234,567 or €1.134.567). */
export function formatCurrencyFull(
  value: number,
  currency: CurrencyCode = 'USD'
): string {
  const n = safeNumber(value)
  const display = currency === 'USD' ? n : toDisplayCurrency(n, currency)
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: 'currency',
    currency: CURRENCY_SYMBOLS[currency],
    maximumFractionDigits: 0,
  }).format(display)
}

/** Prefix for short format (e.g. $ for USD, € for EUR). */
export function getCurrencyPrefix(currency: CurrencyCode): string {
  const n = 0
  const formatted = new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: 'currency',
    currency: CURRENCY_SYMBOLS[currency],
    maximumFractionDigits: 0,
  }).format(n)
  return formatted.replace(/\d/g, '').trim() || (currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£')
}
