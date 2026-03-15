import { useLocation } from 'react-router-dom'

const STEPS = [
  { path: '/', label: 'Landing' },
  { path: '/inputs', label: 'Inputs' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/summary', label: 'Summary' },
]

export function StepIndicator(): JSX.Element {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <nav className="flex items-center justify-center gap-2 py-4" aria-label="Progress">
      {STEPS.map((step, index) => {
        const isActive = currentPath === step.path
        return (
          <div key={step.path} className="flex items-center">
            <span
              className={`rounded-full px-3 py-1 text-sm ${
                isActive
                  ? 'bg-orange-500 text-white'
                  : 'bg-navy-700 text-slate-400'
              }`}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="mx-1 text-slate-500">→</span>
            )}
          </div>
        )
      })}
    </nav>
  )
}
