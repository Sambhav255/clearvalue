import type { CompanySize } from '../types'
import type { UserInputs } from '../types'

export const PRESETS: Record<CompanySize, UserInputs> = {
  smb: {
    companyName: 'Acme Corp',
    industry: 'Technology',
    storageTB: 50,
    arrayPricePerTB: 80,
    refreshCycleYears: 4,
    migrationLaborCost: 15000,
    kwhRate: 0.12,
    adminFTEs: 0.5,
    adminFullyLoadedCost: 120000,
    adminTimePct: 60,
    downtimeCostPerHour: 5000,
  },
  midmarket: {
    companyName: 'Acme Corp',
    industry: 'Technology',
    storageTB: 500,
    arrayPricePerTB: 65,
    refreshCycleYears: 4,
    migrationLaborCost: 15000,
    kwhRate: 0.1,
    adminFTEs: 1.5,
    adminFullyLoadedCost: 120000,
    adminTimePct: 60,
    downtimeCostPerHour: 50000,
  },
  enterprise: {
    companyName: 'Acme Corp',
    industry: 'Technology',
    storageTB: 5000,
    arrayPricePerTB: 50,
    refreshCycleYears: 5,
    migrationLaborCost: 15000,
    kwhRate: 0.08,
    adminFTEs: 5,
    adminFullyLoadedCost: 140000,
    adminTimePct: 50,
    downtimeCostPerHour: 200000,
  },
}
