import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import calculateTCO from '../lib/tcoModel'
import type { ScenarioType, TCOResults } from '../types'
import { useInputs } from './InputContext'

interface ResultsContextValue {
  results: TCOResults
  scenario: ScenarioType
  setScenario: (s: ScenarioType) => void
}

const ResultsContext = createContext<ResultsContextValue | null>(null)

export function ResultsProvider({ children }: { children: ReactNode }) {
  const { inputs } = useInputs()
  const [scenario, setScenarioState] = useState<ScenarioType>('base')

  const setScenario = useCallback((s: ScenarioType) => {
    setScenarioState(s)
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
