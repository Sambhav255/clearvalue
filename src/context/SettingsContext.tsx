import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CurrencyCode } from '../types'

const STORAGE_KEY_CURRENCY = 'clearvalue_currency'

function loadCurrency(): CurrencyCode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENCY)
    if (raw === 'EUR' || raw === 'GBP' || raw === 'USD') return raw
  } catch {
    // ignore
  }
  return 'USD'
}

interface SettingsContextValue {
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(loadCurrency)

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c)
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, c)
    } catch {
      // ignore
    }
  }, [])

  const value = useMemo(
    () => ({ currency, setCurrency }),
    [currency, setCurrency]
  )

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  )
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
