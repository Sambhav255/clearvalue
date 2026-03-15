import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { KPICard } from '../ui/KPICard'
import { StepIndicator } from '../ui/StepIndicator'
import { useInputs } from '../../context/InputContext'
import { useResults } from '../../context/ResultsContext'
import { generateExecutiveSummary, type SummaryParams } from '../../lib/geminiApi'
import { formatCurrencyFull } from '../../lib/formatters'
import type { CompanySize } from '../../types'

const COMPANY_SIZE_LABEL: Record<CompanySize, string> = {
  smb: 'SMB',
  midmarket: 'Mid-Market',
  enterprise: 'Enterprise',
}

type SummaryStatus = 'idle' | 'loading' | 'generated' | 'error'

export function SummaryScreen(): JSX.Element {
  const navigate = useNavigate()
  const { inputs, activePreset, applyPreset } = useInputs()
  const { results, scenario } = useResults()
  const [status, setStatus] = useState<SummaryStatus>('idle')
  const [generatedText, setGeneratedText] = useState('')

  const scenarioLabel =
    scenario === 'conservative'
      ? 'Conservative'
      : scenario === 'optimistic'
        ? 'Optimistic'
        : 'Base'
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const companySizeLabel = activePreset
    ? COMPANY_SIZE_LABEL[activePreset]
    : 'Mid-Market'

  const handleGenerate = useCallback(async () => {
    setStatus('loading')
    const params: SummaryParams = {
      companyName: inputs.companyName,
      industry: inputs.industry,
      companySize: companySizeLabel,
      storageTB: inputs.storageTB,
      refreshCycle: inputs.refreshCycleYears,
      admins: inputs.adminFTEs,
      adminCost: inputs.adminFullyLoadedCost,
      scenario,
      totalSavings: results.totalSavings3yr,
      topLever: results.topLever,
      topLeverValue: results.topLeverValue,
      npv: results.npv,
      paybackMonths: results.paybackMonths,
      roi: results.roi,
    }
    try {
      const text = await generateExecutiveSummary(params)
      setGeneratedText(text)
      setStatus('generated')
    } catch {
      setStatus('error')
    }
  }, [inputs, results, scenario, companySizeLabel])

  const handleCopy = useCallback(async () => {
    const header = `EVERPURE PLATFORM — VALUE ASSESSMENT\nPrepared for: ${inputs.companyName}  |  ${inputs.industry}  |  ${dateStr}\nScenario: ${scenarioLabel}\n\n`
    try {
      await navigator.clipboard.writeText(header + generatedText)
    } catch {
      // Clipboard may fail on non-HTTPS or if user denies; leave UI as-is
    }
  }, [inputs.companyName, inputs.industry, dateStr, scenarioLabel, generatedText])

  const handleStartNew = useCallback(() => {
    applyPreset('midmarket')
    navigate('/')
  }, [applyPreset, navigate])

  const paybackDisplay =
    results.paybackMonths === Infinity || !Number.isFinite(results.paybackMonths)
      ? 'N/A'
      : `${Math.round(results.paybackMonths)} mo`

  return (
    <div className="min-h-screen bg-navy-900 px-6 py-8">
      <StepIndicator />
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-8">
          <div className="flex-[6] space-y-4">
            <div className="rounded-xl bg-navy-700 p-6 shadow-lg">
              <h1 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Everpure Platform — Value Assessment
              </h1>
              <p className="mt-2 text-slate-100">
                Prepared for: {inputs.companyName} | {inputs.industry} |{' '}
                {dateStr}
              </p>
              <p className="mt-1 text-slate-400">Scenario: {scenarioLabel}</p>
            </div>

            {status === 'idle' && (
              <div className="flex justify-center rounded-xl bg-navy-700 p-12 shadow-lg">
                <Button variant="primary" size="lg" onClick={handleGenerate}>
                  Generate Executive Summary
                </Button>
              </div>
            )}

            {status === 'loading' && (
              <div className="rounded-xl bg-navy-700 p-8 shadow-lg">
                <div className="h-48 animate-pulse rounded bg-navy-800" />
                <p className="mt-4 text-center text-slate-400">
                  Analyzing your environment...
                </p>
              </div>
            )}

            {status === 'generated' && (
              <div className="rounded-xl bg-navy-700 p-6 shadow-lg">
                <div className="whitespace-pre-wrap text-slate-100">
                  {generatedText}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="secondary" size="sm" onClick={handleGenerate}>
                    Regenerate
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    Copy to Clipboard
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-xl bg-navy-700 p-6 shadow-lg">
                <p className="text-slate-400">
                  Unable to generate summary. Your financial results are still
                  valid above.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-4"
                  onClick={handleGenerate}
                >
                  Regenerate
                </Button>
              </div>
            )}
          </div>

          <div className="flex-[4] space-y-3">
            <KPICard
              label="Total 3-Year Savings"
              value={formatCurrencyFull(results.totalSavings3yr)}
              accent
              className="p-4"
            />
            <KPICard
              label="NPV"
              value={formatCurrencyFull(results.npv)}
              accent
              className="p-4"
            />
            <KPICard
              label="Payback Period"
              value={paybackDisplay}
              className="p-4"
            />
            <KPICard
              label="ROI"
              value={`${results.roi.toFixed(1)}%`}
              className="p-4"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <Button variant="ghost" onClick={handleStartNew}>
            Start New Analysis
          </Button>
        </div>
      </div>
    </div>
  )
}
