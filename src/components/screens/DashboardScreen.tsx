import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { KPICard } from '../ui/KPICard'
import { Tooltip } from '../ui/Tooltip'
import { StepIndicator } from '../ui/StepIndicator'
import { ComparisonBarChart } from '../charts/ComparisonBarChart'
import { useResults } from '../../context/ResultsContext'
import { formatCurrencyFull } from '../../lib/formatters'
import type { ScenarioType } from '../../types'
import {
  Zap,
  RefreshCw,
  Users,
  ShieldAlert,
  Info,
} from 'lucide-react'

const SCENARIOS: { id: ScenarioType; label: string }[] = [
  { id: 'conservative', label: 'Conservative' },
  { id: 'base', label: 'Base' },
  { id: 'optimistic', label: 'Optimistic' },
]

const LEVER_CONFIG = [
  {
    key: 'power' as const,
    name: 'Power & Cooling Savings',
    icon: Zap,
    tooltip:
      "Based on Everpure's published 10x power efficiency advantage over legacy disk/hybrid arrays. Legacy average: ~25W/TB. Everpure average: ~2.5W/TB. Cooling multiplier of 1.4x is the industry standard PUE delta.",
  },
  {
    key: 'refresh' as const,
    name: 'Refresh & Migration Avoidance',
    icon: RefreshCw,
    tooltip:
      "Legacy arrays require a hardware refresh every 3–5 years, typically costing 80% of the original purchase price plus 2–4 weeks of migration labor. Everpure's Evergreen subscription eliminates this cost entirely.",
  },
  {
    key: 'admin' as const,
    name: 'Admin Labor Reduction',
    icon: Users,
    tooltip:
      "ESG's independent validation of Everpure's Pure1 platform found a 32% reduction in storage administration labor. Source: ESG Economic Validation, 2024.",
  },
  {
    key: 'downtime' as const,
    name: 'Downtime Risk Mitigation',
    icon: ShieldAlert,
    tooltip:
      "Based on availability delta: Legacy 99.99% = 4.38 hrs downtime/yr. Everpure 99.9999% = 0.053 hrs/yr. Difference × customer's hourly downtime cost.",
  },
]

export function DashboardScreen(): JSX.Element {
  const navigate = useNavigate()
  const { results, scenario, setScenario } = useResults()

  const leverSavings = {
    power: results.powerSavings,
    refresh: results.refreshSavings,
    admin: results.adminSavings,
    downtime: results.downtimeSavings,
  }
  const lever3yr = {
    power: results.powerSavings * 3 * (scenario === 'conservative' ? 0.6 : scenario === 'optimistic' ? 1.25 : 1),
    refresh: results.refreshSavings * 3 * (scenario === 'conservative' ? 0.6 : scenario === 'optimistic' ? 1.25 : 1),
    admin: results.adminSavings * 3 * (scenario === 'conservative' ? 0.6 : scenario === 'optimistic' ? 1.25 : 1),
    downtime: results.downtimeSavings * 3 * (scenario === 'conservative' ? 0.6 : scenario === 'optimistic' ? 1.25 : 1),
  }
  const paybackDisplay =
    results.paybackMonths === Infinity || !Number.isFinite(results.paybackMonths)
      ? 'N/A'
      : `${Math.round(results.paybackMonths)} mo`

  return (
    <div className="min-h-screen bg-navy-900 px-6 py-8">
      <StepIndicator />
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <KPICard
            label="Total 3-Year Savings"
            value={formatCurrencyFull(results.totalSavings3yr)}
            accent
          />
          <KPICard
            label="NPV (8% discount rate)"
            value={formatCurrencyFull(results.npv)}
            accent
          />
          <KPICard label="Payback Period" value={paybackDisplay} />
          <KPICard label="ROI" value={`${results.roi.toFixed(1)}%`} />
        </div>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">
            Scenario
          </h2>
          <div className="flex gap-2">
            {SCENARIOS.map(({ id, label }) => (
              <Button
                key={id}
                variant={scenario === id ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setScenario(id)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-100">
            3-Year Total Cost Comparison
          </h2>
          <ComparisonBarChart />
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {LEVER_CONFIG.map(({ key, name, icon: Icon, tooltip }) => (
            <Card key={key}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-orange-500" />
                  <span className="font-medium text-slate-100">{name}</span>
                  <Tooltip content={tooltip}>
                    <span className="inline-flex cursor-help">
                      <Info className="h-4 w-4 text-slate-500" />
                    </span>
                  </Tooltip>
                </div>
              </div>
              <p className="mt-2 text-2xl font-semibold text-orange-500">
                {formatCurrencyFull(leverSavings[key])}/yr
              </p>
              <p className="text-sm text-slate-400">
                3-year: {formatCurrencyFull(lever3yr[key])}
              </p>
            </Card>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => navigate('/inputs')}>
            ← Edit Inputs
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/summary')}
          >
            Generate Executive Summary →
          </Button>
        </div>
      </div>
    </div>
  )
}
