import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Tooltip } from '../ui/Tooltip'
import { useInputs } from '../../context/InputContext'
import type { CompanySize } from '../../types'
import { Info } from 'lucide-react'

const CLAMP = {
  storageTB: { min: 1, max: 100_000 },
  kwhRate: { min: 0.01, max: 0.5 },
  refreshCycleYears: { min: 1, max: 10 },
  adminFTEs: { min: 0.1, max: 50 },
  adminTimePct: { min: 1, max: 100 },
  everpurePricePerTB: { min: 50, max: 1000 },
} as const

const INDUSTRIES = [
  'Technology',
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail',
  'Government',
  'Other',
] as const

const PRESET_LABELS: Record<CompanySize, string> = {
  smb: 'SMB',
  midmarket: 'Mid-Market',
  enterprise: 'Enterprise',
}

const inputClass =
  'mt-1 w-full rounded-xl border border-brand-border bg-brand-inputBg px-3 py-2 text-brand-text outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange'

export function InputsScreen(): JSX.Element {
  const navigate = useNavigate()
  const { inputs, activePreset, updateField, applyPreset } = useInputs()
  const [showValidation, setShowValidation] = useState(false)

  const requiredFields: (keyof typeof inputs)[] = [
    'storageTB',
    'arrayPricePerTB',
    'everpurePricePerTB',
    'refreshCycleYears',
    'migrationLaborCost',
    'kwhRate',
    'adminFTEs',
    'adminFullyLoadedCost',
    'downtimeCostPerHour',
  ]
  const invalidFields = showValidation
    ? requiredFields.filter((k) => {
        const v = inputs[k]
        if (typeof v !== 'number') return true
        if (k === 'storageTB') return v < CLAMP.storageTB.min || v > CLAMP.storageTB.max
        if (k === 'kwhRate') return v < CLAMP.kwhRate.min || v > CLAMP.kwhRate.max
        if (k === 'refreshCycleYears') return v < CLAMP.refreshCycleYears.min || v > CLAMP.refreshCycleYears.max
        if (k === 'adminFTEs') return v < CLAMP.adminFTEs.min || v > CLAMP.adminFTEs.max
        if (k === 'everpurePricePerTB') return v < CLAMP.everpurePricePerTB.min || v > CLAMP.everpurePricePerTB.max
        return v <= 0
      })
    : []
  const adminPctInvalid =
    showValidation &&
    (inputs.adminTimePct < CLAMP.adminTimePct.min ||
      inputs.adminTimePct > CLAMP.adminTimePct.max)
  const hasErrors = invalidFields.length > 0 || adminPctInvalid

  const handleCalculate = useCallback(() => {
    setShowValidation(true)
    const storageInvalid =
      inputs.storageTB < CLAMP.storageTB.min ||
      inputs.storageTB > CLAMP.storageTB.max ||
      inputs.storageTB === 0
    const anyInvalid =
      requiredFields.some((k) => {
        const v = inputs[k]
        return typeof v !== 'number' || v <= 0
      }) ||
      storageInvalid ||
      inputs.adminTimePct < CLAMP.adminTimePct.min ||
      inputs.adminTimePct > CLAMP.adminTimePct.max
    if (anyInvalid) return
    navigate('/dashboard')
  }, [inputs, navigate])

  const clamp = useCallback(
    (key: keyof typeof CLAMP, value: number) => {
      const range = CLAMP[key]
      return Math.min(Math.max(value, range.min), range.max)
    },
    []
  )

  return (
    <div className="min-h-screen bg-brand-bg px-6 py-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {hasErrors && (
          <div className="rounded-xl border border-brand-orange bg-brand-orangeLight px-4 py-3 text-sm text-brand-text">
            Please fix the following: all required fields must be greater than
            zero and within the allowed range (Storage 1–100,000 TB; Power
            $0.01–0.50/kWh; Refresh 1–10 yr; Admins 0.1–50 FTE; Admin time 1–100%; Everpure price $50–$1000/TB).
          </div>
        )}
        <Card className="p-8">
          <h2 className="mb-6 text-lg font-semibold text-brand-navy">
            Company Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Company Name
              </label>
              <input
                type="text"
                value={inputs.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Industry
              </label>
              <select
                value={inputs.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                className={inputClass}
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Company Size
              </label>
              <div className="mt-2 flex gap-2">
                {(['smb', 'midmarket', 'enterprise'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={activePreset === size ? 'presetActive' : 'preset'}
                    size="sm"
                    onClick={() => applyPreset(size)}
                  >
                    {PRESET_LABELS[size]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="mb-6 text-lg font-semibold text-brand-navy">
            Current Storage Environment
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Total Storage (TB)
                <Tooltip content="Total TB currently managed across all arrays">
                  <span className="inline-flex">
                    <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                  </span>
                </Tooltip>
              </label>
              <input
                type="number"
                min={CLAMP.storageTB.min}
                max={CLAMP.storageTB.max}
                value={inputs.storageTB || ''}
                onChange={(e) =>
                  updateField(
                    'storageTB',
                    clamp('storageTB', Number(e.target.value) || 0)
                  )
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Array Purchase Cost ($/TB)
                <Tooltip content="Estimated average cost per TB of your current arrays at time of purchase">
                  <span className="inline-flex">
                    <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                  </span>
                </Tooltip>
              </label>
              <input
                type="number"
                min={0}
                value={inputs.arrayPricePerTB || ''}
                onChange={(e) =>
                  updateField(
                    'arrayPricePerTB',
                    Number(e.target.value) || 0
                  )
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Hardware Refresh Cycle (years)
                <Tooltip content="How often your team replaces storage hardware. Industry average: 3–5 years.">
                  <span className="inline-flex">
                    <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                  </span>
                </Tooltip>
              </label>
              <input
                type="number"
                min={CLAMP.refreshCycleYears.min}
                max={CLAMP.refreshCycleYears.max}
                value={inputs.refreshCycleYears || ''}
                onChange={(e) =>
                  updateField(
                    'refreshCycleYears',
                    clamp('refreshCycleYears', Number(e.target.value) || 0)
                  )
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Migration Labor Cost ($)
                <Tooltip content="Estimated labor cost for a single migration event. Includes ~3 weeks of a storage engineer's time.">
                  <span className="inline-flex">
                    <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                  </span>
                </Tooltip>
              </label>
              <input
                type="number"
                min={0}
                value={inputs.migrationLaborCost || ''}
                onChange={(e) =>
                  updateField(
                    'migrationLaborCost',
                    Number(e.target.value) || 0
                  )
                }
                className={inputClass}
              />
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="mb-6 text-lg font-semibold text-brand-navy">
            Everpure Investment
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Estimated Everpure Price ($/TB)
                <Tooltip content="Everpure FlashArray mid-market pricing typically ranges $150-300/TB depending on configuration and contract terms. This is used to calculate payback period and ROI only — contact your Everpure rep for exact pricing.">
                  <span className="inline-flex">
                    <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                  </span>
                </Tooltip>
              </label>
              <input
                type="number"
                min={CLAMP.everpurePricePerTB.min}
                max={CLAMP.everpurePricePerTB.max}
                value={inputs.everpurePricePerTB || ''}
                onChange={(e) =>
                  updateField(
                    'everpurePricePerTB',
                    clamp('everpurePricePerTB', Number(e.target.value) || 0)
                  )
                }
                className={inputClass}
              />
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="mb-6 text-lg font-semibold text-brand-navy">
            Operational Inputs
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Power Cost ($/kWh)
                <Tooltip content="Your data center's blended electricity rate. US data center average: $0.07–0.12.">
                  <span className="inline-flex">
                    <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                  </span>
                </Tooltip>
              </label>
              <input
                type="number"
                min={CLAMP.kwhRate.min}
                max={CLAMP.kwhRate.max}
                step={0.01}
                value={inputs.kwhRate || ''}
                onChange={(e) =>
                  updateField(
                    'kwhRate',
                    clamp('kwhRate', Number(e.target.value) || 0)
                  )
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Storage Admins (FTE)
                <Tooltip content="Full-time equivalents whose primary responsibility includes storage management.">
                  <span className="inline-flex">
                    <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                  </span>
                </Tooltip>
              </label>
              <input
                type="number"
                min={CLAMP.adminFTEs.min}
                max={CLAMP.adminFTEs.max}
                step={0.1}
                value={inputs.adminFTEs || ''}
                onChange={(e) =>
                  updateField(
                    'adminFTEs',
                    clamp('adminFTEs', Number(e.target.value) || 0)
                  )
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Admin Fully-Loaded Cost ($/yr)
                <Tooltip content="Total cost including salary, benefits, and overhead. US storage admin average: $110–140k.">
                  <span className="inline-flex">
                    <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                  </span>
                </Tooltip>
              </label>
              <input
                type="number"
                min={0}
                value={inputs.adminFullyLoadedCost || ''}
                onChange={(e) =>
                  updateField(
                    'adminFullyLoadedCost',
                    Number(e.target.value) || 0
                  )
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Admin % Time on Storage
                <Tooltip content="Percentage of each admin's time spent on storage-related tasks.">
                  <span className="inline-flex">
                    <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                  </span>
                </Tooltip>
              </label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="range"
                  min={CLAMP.adminTimePct.min}
                  max={CLAMP.adminTimePct.max}
                  value={Math.min(
                    Math.max(inputs.adminTimePct ?? 60, CLAMP.adminTimePct.min),
                    CLAMP.adminTimePct.max
                  )}
                  onChange={(e) =>
                    updateField(
                      'adminTimePct',
                      clamp('adminTimePct', Number(e.target.value))
                    )
                  }
                  className="flex-1 accent-brand"
                />
                <span className="w-12 text-brand-text">
                  {Math.min(
                    Math.max(inputs.adminTimePct ?? 60, CLAMP.adminTimePct.min),
                    CLAMP.adminTimePct.max
                  )}%
                </span>
              </div>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
                Downtime Cost ($/hr)
                <Tooltip content="Business cost of one hour of storage-related downtime. Includes lost revenue, SLA penalties, and recovery labor.">
                  <span className="inline-flex">
                    <Info className="h-4 w-4 text-brand-textMuted hover:text-brand-orange" />
                  </span>
                </Tooltip>
              </label>
              <input
                type="number"
                min={0}
                value={inputs.downtimeCostPerHour || ''}
                onChange={(e) =>
                  updateField(
                    'downtimeCostPerHour',
                    Number(e.target.value) || 0
                  )
                }
                className={inputClass}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end max-sm:w-full">
          <Button
            variant="primary"
            size="lg"
            disabled={inputs.storageTB === 0}
            onClick={handleCalculate}
            className="w-full max-sm:max-w-none sm:w-auto"
          >
            Calculate Value →
          </Button>
        </div>
      </div>
    </div>
  )
}
