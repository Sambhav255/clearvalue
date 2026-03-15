import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import {
  FileSpreadsheet,
  Sparkles,
  ClipboardCheck,
} from 'lucide-react'

export function LandingScreen(): JSX.Element {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col bg-navy-900">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
          ClearValue
        </h1>
        <p className="mt-3 text-xl text-slate-100">
          Translate infrastructure decisions into financial outcomes.
        </p>
        <p className="mt-4 text-slate-400">
          Build a defensible, CFO-ready business case in under 3 minutes.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-8"
          onClick={() => navigate('/inputs')}
        >
          Build Your Value Case →
        </Button>

        <div className="mt-24 grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <FileSpreadsheet className="h-10 w-10 text-orange-500" />
            <p className="mt-2 text-slate-100">
              Four value levers modeled automatically
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Sparkles className="h-10 w-10 text-orange-500" />
            <p className="mt-2 text-slate-100">
              AI-generated executive summary
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ClipboardCheck className="h-10 w-10 text-orange-500" />
            <p className="mt-2 text-slate-100">
              Audit-ready assumptions on every number
            </p>
          </div>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-slate-400">
        Built by Sambhav Lamichhane
      </footer>
    </div>
  )
}
