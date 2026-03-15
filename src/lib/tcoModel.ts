import type { UserInputs, TCOResults, ScenarioType } from '../types'

const SCENARIO_MULTIPLIER: Record<ScenarioType, number> = {
  conservative: 0.6,
  base: 1.0,
  optimistic: 1.25,
}

const LEVER_NAMES = {
  powerSavings: 'Power & Cooling',
  refreshSavings: 'Refresh & Migration Avoidance',
  adminSavings: 'Admin Labor Reduction',
  downtimeSavings: 'Downtime Risk Mitigation',
} as const

function calculatePowerSavings(inputs: UserInputs): number {
  const legacyPowerCost =
    (inputs.storageTB * 22.5 * 8760 * inputs.kwhRate * 1.4) / 1000
  const everpurePowerCost =
    (inputs.storageTB * 2.5 * 8760 * inputs.kwhRate * 1.4) / 1000
  return legacyPowerCost - everpurePowerCost
}

function calculateRefreshSavings(inputs: UserInputs): number {
  const refreshCostPerCycle =
    inputs.arrayPricePerTB * inputs.storageTB * 0.8 + inputs.migrationLaborCost
  return refreshCostPerCycle / inputs.refreshCycleYears
}

function calculateAdminSavings(inputs: UserInputs): number {
  const currentAdminCost =
    inputs.adminFTEs *
    inputs.adminFullyLoadedCost *
    (inputs.adminTimePct / 100)
  return currentAdminCost * 0.32
}

function calculateDowntimeSavings(inputs: UserInputs): number {
  const legacyDowntimeHours = 4.38
  const everpureDowntimeHours = 0.0526
  return (
    (legacyDowntimeHours - everpureDowntimeHours) * inputs.downtimeCostPerHour
  )
}

export default function calculateTCO(
  inputs: UserInputs,
  scenario: ScenarioType
): TCOResults {
  const powerSavings = calculatePowerSavings(inputs)
  const refreshSavings = calculateRefreshSavings(inputs)
  const adminSavings = calculateAdminSavings(inputs)
  const downtimeSavings = calculateDowntimeSavings(inputs)

  const annualSavings =
    powerSavings + refreshSavings + adminSavings + downtimeSavings
  const mult = SCENARIO_MULTIPLIER[scenario]
  const totalSavings3yr = annualSavings * 3 * mult

  const legacyArrayCost = inputs.arrayPricePerTB * inputs.storageTB
  const everpurePremium = legacyArrayCost * 0.25

  const npv =
    (annualSavings * mult) / 1.08 +
    (annualSavings * mult) / 1.08 ** 2 +
    (annualSavings * mult) / 1.08 ** 3

  const annualSavingsAdjusted = annualSavings * mult
  const paybackMonths =
    annualSavingsAdjusted > 0
      ? (everpurePremium / annualSavingsAdjusted) * 12
      : Infinity

  const roi =
    everpurePremium > 0
      ? ((totalSavings3yr - everpurePremium) / everpurePremium) * 100
      : 0

  const leverValues: Record<string, number> = {
    powerSavings,
    refreshSavings,
    adminSavings,
    downtimeSavings,
  }
  let topLever: string = LEVER_NAMES.powerSavings
  let topLeverValue = powerSavings
  for (const [key, value] of Object.entries(leverValues)) {
    if (value > topLeverValue) {
      topLeverValue = value
      topLever = LEVER_NAMES[key as keyof typeof LEVER_NAMES]
    }
  }

  const legacyPowerCost =
    (inputs.storageTB * 22.5 * 8760 * inputs.kwhRate * 1.4) / 1000
  const everpurePowerCost =
    (inputs.storageTB * 2.5 * 8760 * inputs.kwhRate * 1.4) / 1000
  const annualRefreshCost =
    (inputs.arrayPricePerTB * inputs.storageTB * 0.8 + inputs.migrationLaborCost) /
    inputs.refreshCycleYears
  const currentAdminCost =
    inputs.adminFTEs *
    inputs.adminFullyLoadedCost *
    (inputs.adminTimePct / 100)

  return {
    powerSavings,
    refreshSavings,
    adminSavings,
    downtimeSavings,
    annualSavings,
    totalSavings3yr,
    npv,
    paybackMonths,
    roi,
    topLever,
    topLeverValue,
    everpurePremium,
    legacyPowerCost,
    everpurePowerCost,
    legacy3yrPower: legacyPowerCost * 3,
    everpure3yrPower: everpurePowerCost * 3,
    legacy3yrRefresh: annualRefreshCost * 3,
    everpure3yrRefresh: 0,
    legacy3yrAdmin: currentAdminCost * 3,
    everpure3yrAdmin: currentAdminCost * 0.68 * 3,
    legacy3yrDowntime: 4.38 * inputs.downtimeCostPerHour * 3,
    everpure3yrDowntime: 0.0526 * inputs.downtimeCostPerHour * 3,
  }
}
