import type { ReactNode } from 'react'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { InputProvider, useInputs } from './context/InputContext'
import { ResultsProvider } from './context/ResultsContext'
import { SettingsProvider } from './context/SettingsContext'
import { AppHeader } from './components/AppHeader'
import { AboutScreen } from './components/screens/AboutScreen'
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
      <Route path="/about" element={<AboutScreen />} />
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
      <SettingsProvider>
        <InputProvider>
          <ResultsProvider>
            <div className="min-h-screen bg-brand-bg font-sans text-brand-text">
              <AppHeader />
              <AppRoutes />
            </div>
          </ResultsProvider>
        </InputProvider>
      </SettingsProvider>
    </Router>
  )
}

export default App
