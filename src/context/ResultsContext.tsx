import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import calculateTCO from '../lib/tcoModel'
import type { ScenarioType, TCOResults } from '../types'
import { useInputs } from './InputContext'

const STORAGE_KEY_SCENARIO = 'clearvalue_scenario'

function loadStoredScenario(): ScenarioType {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SCENARIO)
    if (raw === 'conservative' || raw === 'base' || raw === 'optimistic') return raw
  } catch {
    // ignore
  }
  return 'base'
}

interface ResultsContextValue {
  results: TCOResults
  scenario: ScenarioType
  setScenario: (s: ScenarioType) => void
}

const ResultsContext = createContext<ResultsContextValue | null>(null)

export function ResultsProvider({ children }: { children: ReactNode }) {
  const { inputs } = useInputs()
  const [scenario, setScenarioState] = useState<ScenarioType>(loadStoredScenario)

  const setScenario = useCallback((s: ScenarioType) => {
    setScenarioState(s)
    try {
      localStorage.setItem(STORAGE_KEY_SCENARIO, s)
    } catch {
      // ignore
    }
  }, [])

  const results = useMemo(
    () => calculateTCO(inputs, scenario),
    [inputs, scenario]
  )

  const value = useMemo(
    () => ({ results, scenario, setScenario }),
    [results, scenario, setScenario]
  )

  return (
    <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>
  )
}

export function useResults(): ResultsContextValue {
  const ctx = useContext(ResultsContext)
  if (!ctx) throw new Error('useResults must be used within ResultsProvider')
  return ctx
}
