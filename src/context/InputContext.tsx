import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { PRESETS } from '../lib/benchmarks'
import type { CompanySize, UserInputs } from '../types'

const STORAGE_KEY_INPUTS = 'clearvalue_inputs'
const STORAGE_KEY_PRESET = 'clearvalue_preset'

interface InputContextValue {
  inputs: UserInputs
  activePreset: CompanySize | null
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>
  updateField: <K extends keyof UserInputs>(
    field: K,
    value: UserInputs[K]
  ) => void
  applyPreset: (size: CompanySize) => void
}

const defaultInputs: UserInputs = PRESETS.midmarket

function loadStoredInputs(): UserInputs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INPUTS)
    if (!raw) return defaultInputs
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object' && 'storageTB' in parsed && 'companyName' in parsed) {
      return { ...defaultInputs, ...parsed } as UserInputs
    }
  } catch {
    // ignore
  }
  return defaultInputs
}

function loadStoredPreset(): CompanySize | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRESET)
    if (raw === 'smb' || raw === 'midmarket' || raw === 'enterprise') return raw
  } catch {
    // ignore
  }
  return null
}

const InputContext = createContext<InputContextValue | null>(null)

export function InputProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<UserInputs>(loadStoredInputs)
  const [activePreset, setActivePreset] = useState<CompanySize | null>(loadStoredPreset)

  const updateField = useCallback(
    <K extends keyof UserInputs>(field: K, value: UserInputs[K]) => {
      setInputs((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const applyPreset = useCallback((size: CompanySize) => {
    setInputs({ ...PRESETS[size] })
    setActivePreset(size)
    try {
      localStorage.setItem(STORAGE_KEY_PRESET, size)
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_INPUTS, JSON.stringify(inputs))
    } catch {
      // ignore
    }
  }, [inputs])

  const value = useMemo(
    () => ({ inputs, activePreset, setInputs, updateField, applyPreset }),
    [inputs, activePreset, updateField, applyPreset]
  )

  return (
    <InputContext.Provider value={value}>{children}</InputContext.Provider>
  )
}

export function useInputs(): InputContextValue {
  const ctx = useContext(InputContext)
  if (!ctx) throw new Error('useInputs must be used within InputProvider')
  return ctx
}
