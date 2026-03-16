import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { KPICard } from '../ui/KPICard'
import { useInputs } from '../../context/InputContext'
import { useResults } from '../../context/ResultsContext'
import { useSettings } from '../../context/SettingsContext'
import { generateExecutiveSummary, SummaryGenerationError, type SummaryParams } from '../../lib/geminiApi'
import { formatCurrencyFull } from '../../lib/formatters'
import { downloadPDFReport } from '../../lib/pdfExport'
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
  const { currency } = useSettings()
  const [status, setStatus] = useState<SummaryStatus>('idle')
  const [generatedText, setGeneratedText] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
    setErrorMessage(null)
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
    } catch (err) {
      setStatus('error')
      const raw =
        err instanceof SummaryGenerationError
          ? err.userMessage
          : err instanceof Error
            ? err.message
            : 'Something went wrong. Try again.'
      // #region agent log
      fetch('http://127.0.0.1:7549/ingest/3333e265-2fd7-4b40-a746-6557a6836ef1',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'4d3b58'},body:JSON.stringify({sessionId:'4d3b58',location:'SummaryScreen.tsx:catch',message:'caught error',data:{raw,errName:err instanceof Error?err.name:'',isSummaryErr:err instanceof SummaryGenerationError},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      const friendly =
        raw === 'Failed to fetch'
          ? 'Cannot reach the API. Check your connection and try again.'
          : raw
      setErrorMessage(friendly)
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

  const handleDownloadPDF = useCallback(() => {
    downloadPDFReport({
      companyName: inputs.companyName,
      industry: inputs.industry,
      scenarioLabel,
      dateStr,
      results,
      currency,
      generatedMemo: generatedText,
    })
  }, [inputs.companyName, inputs.industry, scenarioLabel, dateStr, results, currency, generatedText])

  const handleStartNew = useCallback(() => {
    applyPreset('midmarket')
    navigate('/')
  }, [applyPreset, navigate])

  const paybackDisplay =
    results.paybackMonths === Infinity || !Number.isFinite(results.paybackMonths)
      ? 'N/A'
      : `${Math.round(results.paybackMonths)} mo`

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex gap-8">
          <div className="flex-[6] space-y-4">
            <div className="rounded-r-xl border-l-4 border-brand-orange bg-brand-orangeLight px-6 py-4">
              <h1 className="text-sm font-semibold uppercase tracking-wide text-brand-navy">
                Everpure Platform — Value Assessment
              </h1>
              <p className="mt-2 text-brand-text">
                Prepared for: {inputs.companyName} | {inputs.industry} |{' '}
                {dateStr}
              </p>
              <p className="mt-1 text-brand-textSecondary">
                Scenario: {scenarioLabel}
              </p>
            </div>

            {status === 'idle' && (
              <div className="flex justify-center rounded-2xl border border-brand-cardBorder bg-brand-card p-12 shadow-sm">
                <Button variant="primary" size="lg" onClick={handleGenerate}>
                  Generate Executive Summary
                </Button>
              </div>
            )}

            {status === 'loading' && (
              <div className="rounded-2xl border border-brand-cardBorder bg-brand-card p-8 shadow-sm">
                <div className="h-48 animate-pulse rounded-xl bg-brand-inputBg" />
                <p className="mt-4 text-center text-brand-textSecondary">
                  Analyzing your environment...
                </p>
              </div>
            )}

            {status === 'generated' && (
              <div className="rounded-2xl border border-brand-cardBorder bg-brand-card p-6 shadow-sm">
                <div className="whitespace-pre-wrap text-base leading-relaxed text-brand-text">
                  {generatedText}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={handleGenerate}>
                    Regenerate
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleCopy}>
                    Copy to Clipboard
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleDownloadPDF}>
                    Download PDF Report
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-2xl border border-brand-cardBorder bg-brand-card p-6 shadow-sm">
                <p className="text-brand-textSecondary">
                  Unable to generate summary. Your financial results are still
                  valid above.
                </p>
                {errorMessage != null && (
                  <p className="mt-2 text-sm text-brand-text">
                    {errorMessage}
                  </p>
                )}
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
              value={formatCurrencyFull(results.totalSavings3yr, currency)}
              accent
              className="p-4"
            />
            <KPICard
              label="NPV"
              value={formatCurrencyFull(results.npv, currency)}
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

        <div className="mt-8 flex flex-wrap justify-between gap-2">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleDownloadPDF}>
              Download PDF Report
            </Button>
            <Button variant="ghost" onClick={handleStartNew}>
              Start New Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
