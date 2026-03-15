import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { PRESETS } from '../lib/benchmarks'
import type { CompanySize, UserInputs } from '../types'

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

const InputContext = createContext<InputContextValue | null>(null)

export function InputProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<UserInputs>(defaultInputs)
  const [activePreset, setActivePreset] = useState<CompanySize | null>('midmarket')

  const updateField = useCallback(
    <K extends keyof UserInputs>(field: K, value: UserInputs[K]) => {
      setInputs((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const applyPreset = useCallback((size: CompanySize) => {
    setInputs({ ...PRESETS[size] })
    setActivePreset(size)
  }, [])

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
