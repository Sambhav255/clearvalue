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

const LEGACY_WATTS_PER_TB = 2.85
const EVERPURE_WATTS_PER_TB = 0.11
const PUE_MULTIPLIER = 1.56
const REFRESH_HARDWARE_COST_PCT = 2.0
const LEGACY_DOWNTIME_HOURS = 0.876
const EVERPURE_DOWNTIME_HOURS = 0.00876

function calculatePowerSavings(inputs: UserInputs): number {
  const legacyPowerCost =
    (inputs.storageTB * LEGACY_WATTS_PER_TB * 8760 * inputs.kwhRate * PUE_MULTIPLIER) / 1000
  const everpurePowerCost =
    (inputs.storageTB * EVERPURE_WATTS_PER_TB * 8760 * inputs.kwhRate * PUE_MULTIPLIER) / 1000
  return legacyPowerCost - everpurePowerCost
}

function calculateRefreshSavings(inputs: UserInputs): number {
  const refreshCostPerCycle =
    inputs.arrayPricePerTB * inputs.storageTB * REFRESH_HARDWARE_COST_PCT + inputs.migrationLaborCost
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
  return (
    (LEGACY_DOWNTIME_HOURS - EVERPURE_DOWNTIME_HOURS) * inputs.downtimeCostPerHour
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

  // Everpure premium is modeled as the total Everpure investment,
  // using an estimated Everpure price per TB.
  const everpurePremium = inputs.storageTB * inputs.everpurePricePerTB

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
    (inputs.storageTB * LEGACY_WATTS_PER_TB * 8760 * inputs.kwhRate * PUE_MULTIPLIER) / 1000
  const everpurePowerCost =
    (inputs.storageTB * EVERPURE_WATTS_PER_TB * 8760 * inputs.kwhRate * PUE_MULTIPLIER) / 1000
  const annualRefreshCost =
    (inputs.arrayPricePerTB * inputs.storageTB * REFRESH_HARDWARE_COST_PCT + inputs.migrationLaborCost) /
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
    legacy3yrDowntime: LEGACY_DOWNTIME_HOURS * inputs.downtimeCostPerHour * 3,
    everpure3yrDowntime: EVERPURE_DOWNTIME_HOURS * inputs.downtimeCostPerHour * 3,
  }
}
