export type ScenarioType = 'conservative' | 'base' | 'optimistic'
export type CompanySize = 'smb' | 'midmarket' | 'enterprise'

export interface UserInputs {
  companyName: string
  industry: string
  storageTB: number
  arrayPricePerTB: number
  refreshCycleYears: number
  migrationLaborCost: number
  kwhRate: number
  adminFTEs: number
  adminFullyLoadedCost: number
  adminTimePct: number
  downtimeCostPerHour: number
}

export interface TCOResults {
  powerSavings: number
  refreshSavings: number
  adminSavings: number
  downtimeSavings: number
  annualSavings: number
  totalSavings3yr: number
  npv: number
  paybackMonths: number
  roi: number
  topLever: string
  topLeverValue: number
  everpurePremium: number
  legacyPowerCost: number
  everpurePowerCost: number
  legacy3yrPower: number
  everpure3yrPower: number
  legacy3yrRefresh: number
  everpure3yrRefresh: number
  legacy3yrAdmin: number
  everpure3yrAdmin: number
  legacy3yrDowntime: number
  everpure3yrDowntime: number
}
