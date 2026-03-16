import { useLocation, Link } from 'react-router-dom'
import { StepIndicator } from './ui/StepIndicator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/Select'
import { useSettings } from '../context/SettingsContext'
import type { CurrencyCode } from '../types'

const CURRENCY_OPTIONS: { value: CurrencyCode; label: string }[] = [
  { value: 'USD', label: 'USD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
]

export function AppHeader(): JSX.Element | null {
  const location = useLocation()
  const { currency, setCurrency } = useSettings()
  if (location.pathname === '/about') return null

  return (
    <header className="flex items-center justify-between border-b border-brand-border bg-brand-bg px-4 py-3 sm:px-6">
      <div className="flex flex-1 items-center gap-2">
        <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CURRENCY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-[11px] text-brand-textMuted">
          (indicative rates only)
        </span>
      </div>
      <StepIndicator />
      <div className="flex flex-1 justify-end">
        <Link
          to="/about"
          className="text-sm text-brand-textSecondary transition-colors hover:text-brand-orange"
        >
          About This Tool
        </Link>
      </div>
    </header>
  )
}
