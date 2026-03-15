import type { ReactNode } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { InputProvider, useInputs } from './context/InputContext'
import { ResultsProvider } from './context/ResultsContext'
import { DashboardScreen } from './components/screens/DashboardScreen'
import { InputsScreen } from './components/screens/InputsScreen'
import { LandingScreen } from './components/screens/LandingScreen'
import { SummaryScreen } from './components/screens/SummaryScreen'

function DashboardGuard({ children }: { children: ReactNode }) {
  const { inputs } = useInputs()
  if (inputs.storageTB === 0) return <Navigate to="/inputs" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingScreen />} />
      <Route path="/inputs" element={<InputsScreen />} />
      <Route
        path="/dashboard"
        element={
          <DashboardGuard>
            <DashboardScreen />
          </DashboardGuard>
        }
      />
      <Route
        path="/summary"
        element={
          <DashboardGuard>
            <SummaryScreen />
          </DashboardGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <InputProvider>
        <ResultsProvider>
          <div className="bg-navy-900 min-h-screen text-slate-100">
            <AppRoutes />
          </div>
        </ResultsProvider>
      </InputProvider>
    </Router>
  )
}

export default App
