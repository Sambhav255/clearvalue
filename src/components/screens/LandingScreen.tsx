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
    <div className="relative flex min-h-screen flex-col bg-brand-bg">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.06]"
        aria-hidden
      >
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hex"
              x="0"
              y="0"
              width="60"
              height="52"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="30,2 58,17 58,47 30,62 2,47 2,17"
                fill="none"
                strokeWidth="1.5"
                className="stroke-brand-orange"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" />
        </svg>
      </div>
      <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-16">
        <h1 className="text-5xl font-bold tracking-tight text-brand-navy">
          ClearValue
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-center text-xl font-normal text-brand-text">
          Translate infrastructure decisions into financial outcomes.
        </p>
        <p className="mt-4 text-center text-brand-textSecondary">
          Build a defensible, CFO-ready business case in under 3 minutes.
        </p>
        <Button
          variant="primary"
          size="lg"
          className="mt-8 px-10 py-4 text-lg"
          onClick={() => navigate('/inputs')}
        >
          Build Your Value Case →
        </Button>

        <div className="mt-24 grid max-w-3xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <FileSpreadsheet className="h-8 w-8 text-brand-orange" />
            <p className="mt-2 text-sm text-brand-textSecondary">
              Four value levers modeled automatically
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Sparkles className="h-8 w-8 text-brand-orange" />
            <p className="mt-2 text-sm text-brand-textSecondary">
              AI-generated executive summary
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ClipboardCheck className="h-8 w-8 text-brand-orange" />
            <p className="mt-2 text-sm text-brand-textSecondary">
              Audit-ready assumptions on every number
            </p>
          </div>
        </div>
      </main>
      <footer className="relative py-6 text-center text-sm text-brand-textMuted">
        Built by Sambhav Lamichhane{' '}
        <a
          href="https://clearvalue.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-textMuted hover:text-brand-orange"
        >
          · clearvalue.vercel.app
        </a>
      </footer>
    </div>
  )
}
