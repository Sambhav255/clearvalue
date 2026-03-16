import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { KPICard } from '../ui/KPICard'
import { Tooltip } from '../ui/Tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover'
import { ComparisonBarChart } from '../charts/ComparisonBarChart'
import { SavingsOverTimeChart } from '../charts/SavingsOverTimeChart'
import { useResults } from '../../context/ResultsContext'
import { useSettings } from '../../context/SettingsContext'
import { formatCurrencyFull } from '../../lib/formatters'
import { KPI_TOOLTIPS, LEVER_METADATA } from '../../lib/leverMetadata'
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

type ChartViewMode = 'annual' | '3yr'

const LEVER_CONFIG = [
  {
    key: 'power' as const,
    name: 'Power & Cooling Savings',
    icon: Zap,
    meta: LEVER_METADATA.power,
  },
  {
    key: 'refresh' as const,
    name: 'Refresh & Migration Avoidance',
    icon: RefreshCw,
    meta: LEVER_METADATA.refresh,
  },
  {
    key: 'admin' as const,
    name: 'Admin Labor Reduction',
    icon: Users,
    meta: LEVER_METADATA.admin,
  },
  {
    key: 'downtime' as const,
    name: 'Downtime Risk Mitigation',
    icon: ShieldAlert,
    meta: LEVER_METADATA.downtime,
  },
]

export function DashboardScreen(): JSX.Element {
  const navigate = useNavigate()
  const { currency } = useSettings()
  const { results, scenario, setScenario } = useResults()
  const [chartViewMode, setChartViewMode] = useState<ChartViewMode>('3yr')

  const scenarioMult =
    scenario === 'conservative' ? 0.6 : scenario === 'optimistic' ? 1.25 : 1
  const leverSavings = {
    power: results.powerSavings,
    refresh: results.refreshSavings,
    admin: results.adminSavings,
    downtime: results.downtimeSavings,
  }
  const lever3yr = {
    power: results.powerSavings * 3 * scenarioMult,
    refresh: results.refreshSavings * 3 * scenarioMult,
    admin: results.adminSavings * 3 * scenarioMult,
    downtime: results.downtimeSavings * 3 * scenarioMult,
  }
  const totalSavingsLabel =
    chartViewMode === '3yr' ? 'Total 3-Year Savings' : 'Total Annual Savings'
  const totalSavingsValue =
    chartViewMode === '3yr'
      ? results.totalSavings3yr
      : results.annualSavings * scenarioMult
  const paybackDisplay =
    results.paybackMonths === Infinity || !Number.isFinite(results.paybackMonths)
      ? 'N/A'
      : `${Math.round(results.paybackMonths)} mo`

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <KPICard
            label={totalSavingsLabel}
            value={formatCurrencyFull(totalSavingsValue, currency)}
            accent
            tooltipContent={
              <Tooltip content={KPI_TOOLTIPS.totalSavings3yr}>
                <span className="inline-flex cursor-help">
                  <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                </span>
              </Tooltip>
            }
          />
          <KPICard
            label="NPV (8% discount rate)"
            value={formatCurrencyFull(results.npv, currency)}
            accent
            tooltipContent={
              <Tooltip content={KPI_TOOLTIPS.npv}>
                <span className="inline-flex cursor-help">
                  <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                </span>
              </Tooltip>
            }
          />
          <KPICard
            label="Payback Period"
            value={paybackDisplay}
            tooltipContent={
              <Tooltip content={KPI_TOOLTIPS.paybackPeriod}>
                <span className="inline-flex cursor-help">
                  <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                </span>
              </Tooltip>
            }
          />
          <KPICard
            label="ROI"
            value={`${results.roi.toFixed(1)}%`}
            tooltipContent={
              <Tooltip content={KPI_TOOLTIPS.roi}>
                <span className="inline-flex cursor-help">
                  <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                </span>
              </Tooltip>
            }
          />
        </div>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-brand-navy">
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
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-brand-navy">
              {chartViewMode === '3yr'
                ? '3-Year Total Cost Comparison'
                : 'Annual Cost Comparison'}
            </h2>
            <div className="flex gap-2">
              <Button
                variant={chartViewMode === 'annual' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setChartViewMode('annual')}
              >
                Annual
              </Button>
              <Button
                variant={chartViewMode === '3yr' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setChartViewMode('3yr')}
              >
                3-Year Total
              </Button>
            </div>
          </div>
          <ComparisonBarChart viewMode={chartViewMode} />
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-brand-navy">
            Savings Over Time (Payback)
          </h2>
          <SavingsOverTimeChart />
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {LEVER_CONFIG.map(({ key, name, icon: Icon, meta }) => (
            <Card key={key}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-brand-orange" />
                  <span className="font-medium text-brand-text">{name}</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <span className="inline-flex cursor-help">
                        <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-md">
                      <p className="font-medium text-brand-text">{meta.name}</p>
                      <p className="mt-2 font-mono text-xs text-brand-textSecondary">
                        {meta.formula}
                      </p>
                      <p className="mt-2 text-brand-textSecondary">
                        {meta.source}
                      </p>
                      <p className="mt-2 text-xs text-brand-textMuted">
                        Source: {meta.sourceCitation}
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <p className="mt-2 text-2xl font-semibold text-brand-orange">
                {formatCurrencyFull(leverSavings[key], currency)}/yr
              </p>
              <p className="text-sm text-brand-textSecondary">
                3-year: {formatCurrencyFull(lever3yr[key], currency)}
              </p>
            </Card>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={() => navigate('/inputs')}>
            ← Edit Inputs
          </Button>
          <Button variant="primary" onClick={() => navigate('/summary')}>
            Generate Executive Summary →
          </Button>
        </div>
      </div>
    </div>
  )
}
