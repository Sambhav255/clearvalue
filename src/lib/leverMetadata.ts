/** Audit-ready formula and source for each value lever (per PRD). */

export const LEVER_METADATA = {
  power: {
    name: 'Power & Cooling Savings',
    formula:
      '(TB × 2.85W/TB × 8760hrs × kWh_rate × 1.56 / 1000) − (TB × 0.11W/TB × 8760hrs × kWh_rate × 1.56 / 1000)',
    source:
      'Legacy power draw assumed at 2.85W/TB (Western Digital 2024) versus Everpure at 0.11W/TB (Everpure ESG Report 2024), with a 1.56× PUE multiplier from Uptime Institute 2024.',
    sourceCitation: 'Western Digital 2024; Everpure ESG Report 2024; Uptime Institute 2024',
  },
  refresh: {
    name: 'Refresh & Migration Avoidance',
    formula: '((Array_Cost_per_TB × TB × 2.00) + Migration_Labor) / Refresh_Cycle_Years',
    source:
      'Refresh hardware cost modeled at 2.00× original array price per TB plus one migration event (labor), based on Hitachi Vantara TCO analysis.',
    sourceCitation: 'Hitachi Vantara 2022',
  },
  admin: {
    name: 'Admin Labor Reduction',
    formula: 'FTEs × Loaded_Cost × Time_Pct × 0.32',
    source:
      '32% reduction in storage administration labor on a fully loaded cost of $167,832/FTE, per ESG Economic Validation of Pure1 (2022).',
    sourceCitation: 'ESG Economic Validation 2022',
  },
  downtime: {
    name: 'Downtime Risk Mitigation',
    formula: '(0.876hrs − 0.00876hrs) × Downtime_Cost_per_Hour',
    source:
      'Based on Evergreen//One availability: legacy 99.99% = 0.876 hrs downtime/yr and Everpure 99.9999% = 0.00876 hrs/yr; difference multiplied by customer hourly downtime cost.',
    sourceCitation: 'Evergreen//One Product Guide',
  },
} as const

/** KPI card tooltip copy for dashboard summary metrics. */
export const KPI_TOOLTIPS = {
  totalSavings3yr:
    'Sum of all four value levers (Power, Refresh, Admin, Downtime) over 3 years, adjusted by scenario multiplier.',
  npv: 'Net present value of the 3-year savings stream using an 8% discount rate. Standard enterprise hurdle rate.',
  paybackPeriod:
    'Months to recover the Everpure premium (25% over legacy array cost) from annual savings.',
  roi: 'Return on investment: (3-year savings − Everpure premium) / Everpure premium × 100.',
} as const
