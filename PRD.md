# ClearValue — Product Requirements Document (PRD)
**Version:** 1.0  
**Author:** Sambhav Lamichhane  
**Date:** March 2026  
**Status:** Ready for Development

---

## 1. Overview

### 1.1 Product Summary
ClearValue is an AI-powered TCO (Total Cost of Ownership) and Business Case Generator built to help enterprise sales and value consulting teams translate complex infrastructure decisions into defensible financial narratives. A user inputs their current storage environment, and ClearValue outputs a 3-year TCO comparison, value lever breakdown, and an AI-generated executive summary ready for a CFO or CIO audience.

### 1.2 Problem Statement
Enterprise value consulting teams face three compounding problems:

**Problem 1 — Value conversations happen too late.**  
By the time a Value Consultant is pulled into a deal, the customer is already deep in vendor evaluation. The economic case is built reactively rather than proactively. Sales reps need a self-serve tool to run a first-pass value snapshot in early discovery — before a VC is even involved.

**Problem 2 — Benchmark libraries are static and stale.**  
Every new product release (new storage density, new power profiles) makes existing TCO templates outdated. Someone has to manually update them. A tool with configurable, documented assumptions solves this at scale.

**Problem 3 — Technical-to-financial translation doesn't scale.**  
Sales engineers speak in IOPS and throughput. CFOs speak in NPV and payback periods. Value consultants sit in between but can't be in every conversation. A tool that auto-converts technical inputs into financial outputs democratizes that translation across the entire sales org.

### 1.3 Target Users
| User | Context | Need |
|---|---|---|
| Value Consultant | Pre-sales, deal qualification | Rapid first-pass business case for discovery calls |
| Sales Rep | Early discovery | Quick economic narrative to share with customer finance |
| Recruiter / Hiring Manager | Demo context | See the tool framing the problem and solution |

### 1.4 Success Criteria
- A non-technical user can complete all inputs and get a full business case in under 3 minutes
- The executive summary reads as something a CFO would actually receive
- All assumptions are visible and defensible on hover
- The tool works cleanly on a laptop screen without scrolling issues during a demo

---

## 2. Screens & Features

### Screen 0 — Landing / Hero Page
**Purpose:** Establish credibility and frame the product before the user starts. Makes this feel like a real internal tool, not a homework assignment.

**Content:**
- ClearValue logo + tagline: "Translate infrastructure decisions into financial outcomes."
- One-sentence subheading: "Build a defensible, CFO-ready business case in under 3 minutes."
- Single CTA button: "Build Your Value Case →"
- Three value props below the fold (icons + one line each):
  - "4 value levers modeled automatically"
  - "AI-generated executive summary"
  - "Audit-ready assumptions on every number"
- Footer: "Built by Sambhav Lamichhane · clearvalue.vercel.app"

**No inputs on this screen.**

---

### Screen 1 — Company Profile & Environment Inputs
**Purpose:** Collect the minimum viable data to run the TCO model. Preset buttons reduce friction dramatically.

#### Section A: Company Profile
| Field | Input Type | Default | Notes |
|---|---|---|---|
| Company Name | Text | "Acme Corp" | Used in executive summary |
| Industry | Dropdown | "Technology" | Used for context in AI summary |
| Company Size | Three preset buttons: SMB / Mid-Market / Enterprise | None selected | One click autofills ALL fields below. User can override any field after. |

#### Company Size Presets (autofill values)
| Field | SMB | Mid-Market | Enterprise |
|---|---|---|---|
| Storage (TB) | 50 | 500 | 5,000 |
| Storage Admins (FTE) | 0.5 | 1.5 | 5 |
| Power Cost ($/kWh) | $0.12 | $0.10 | $0.08 |
| Downtime Cost ($/hr) | $5,000 | $50,000 | $200,000 |
| Array Cost ($/TB) | $80 | $65 | $50 |
| Refresh Cycle (years) | 4 | 4 | 5 |
| Admin Fully-Loaded Cost | $120,000 | $120,000 | $140,000 |
| Admin % Time on Storage | 60% | 60% | 50% |

#### Section B: Current Storage Environment
| Field | Input Type | Default | Tooltip Text |
|---|---|---|---|
| Total Storage (TB) | Number slider + manual input | 500 | "Total TB currently managed across all arrays" |
| Array Purchase Cost ($/TB) | Number input | $65 | "Estimated average cost per TB of your current arrays at time of purchase" |
| Hardware Refresh Cycle (years) | Number input | 4 | "How often your team replaces storage hardware. Industry average: 3–5 years." |
| Migration Labor Cost ($) | Number input | $15,000 | "Estimated labor cost for a single migration event. Includes ~3 weeks of a storage engineer's time." |

#### Section C: Operational Inputs
| Field | Input Type | Default | Tooltip Text |
|---|---|---|---|
| Power Cost ($/kWh) | Number input | $0.10 | "Your data center's blended electricity rate. US data center average: $0.07–0.12." |
| Storage Admins (FTE) | Number input | 1.5 | "Full-time equivalents whose primary responsibility includes storage management." |
| Admin Fully-Loaded Cost ($/yr) | Number input | $120,000 | "Total cost including salary, benefits, and overhead. US storage admin average: $110–140k." |
| Admin % Time on Storage | Slider 0–100% | 60% | "Percentage of each admin's time spent on storage-related tasks." |
| Downtime Cost ($/hr) | Number input | $50,000 | "Business cost of one hour of storage-related downtime. Includes lost revenue, SLA penalties, and recovery labor." |

#### Navigation
- "Calculate Value →" button at bottom, disabled until required fields are filled
- Validation: all fields must be non-zero before proceeding

---

### Screen 2 — TCO Comparison Dashboard
**Purpose:** Show the full 3-year financial picture. This is the core value of the tool.

#### Section A: Summary KPI Cards (top row, 4 cards)
| Card | Value Displayed |
|---|---|
| Total 3-Year Savings | Sum of all four value levers over 3 years |
| NPV (8% discount rate) | Net present value of savings stream |
| Payback Period | Months to recover Everpure premium |
| ROI | % return on the Everpure investment |

#### Section B: Scenario Toggle
Three tabs: **Conservative · Base · Optimistic**  
- Conservative: applies 60% of calculated savings (accounts for implementation friction, slower adoption)  
- Base: applies 100% of calculated savings (default)  
- Optimistic: applies 125% of calculated savings (accounts for additional AI/automation gains)  
- All charts and cards update instantly when toggled

#### Section C: Summary Bar Chart
- Side-by-side grouped bar chart: Legacy (3yr total) vs. Everpure (3yr total)
- Four category groups: Power/Cooling · Refresh Avoidance · Admin Labor · Downtime Risk
- X-axis: dollar values formatted as $XM or $XK
- Chart title: "3-Year Total Cost Comparison"
- Colors: Legacy = gray (#6B7280), Everpure = orange (#F97316)

#### Section D: Value Lever Breakdown Cards
Four cards, one per lever, each showing:
- Lever name + icon
- Annual savings figure
- 3-year savings figure  
- One-sentence explanation of the assumption
- Info icon (hover = tooltip with full formula + source)

**Lever 1: Power & Cooling Savings**  
Formula: `(TB × 22.5W/TB × 8760hrs × kWh_rate × 1.4 cooling_multiplier / 1000) - (TB × 2.5W/TB × 8760hrs × kWh_rate × 1.4 / 1000)`  
Tooltip: "Based on Everpure's published 10x power efficiency advantage over legacy disk/hybrid arrays. Legacy average: ~25W/TB. Everpure average: ~2.5W/TB. Cooling multiplier of 1.4x is the industry standard PUE delta."

**Lever 2: Refresh & Migration Avoidance**  
Formula: `((Array_Cost_per_TB × TB × 0.80) + Migration_Labor) / Refresh_Cycle_Years`  
Tooltip: "Legacy arrays require a hardware refresh every 3–5 years, typically costing 80% of the original purchase price plus 2–4 weeks of migration labor. Everpure's Evergreen subscription eliminates this cost entirely."

**Lever 3: Admin Labor Reduction**  
Formula: `FTEs × Loaded_Cost × Time_Pct × 0.32`  
Tooltip: "ESG's independent validation of Everpure's Pure1 platform found a 32% reduction in storage administration labor. Source: ESG Economic Validation, 2024."

**Lever 4: Downtime Risk Mitigation**  
Formula: `(4.38hrs - 0.0526hrs) × Downtime_Cost_per_Hour`  
Tooltip: "Based on availability delta: Legacy 99.99% = 4.38 hrs downtime/yr. Everpure 99.9999% = 0.053 hrs/yr. Difference × customer's hourly downtime cost."

#### Navigation
- "← Edit Inputs" button (returns to Screen 1 with all values preserved)
- "Generate Executive Summary →" button

---

### Screen 3 — AI Executive Summary
**Purpose:** One-click generation of a CFO-ready narrative using Gemini API. This is the differentiating feature that makes ClearValue more than a calculator.

#### Layout
- Left panel (60%): Generated summary text, formatted as a professional memo
- Right panel (40%): Key stats recap (the 4 KPI cards from Screen 2, smaller)

#### Summary Header (static, not AI-generated)
```
EVERPURE PLATFORM — VALUE ASSESSMENT
Prepared for: [Company Name]  |  [Industry]  |  [Date]
Scenario: [Conservative / Base / Optimistic]
```

#### AI-Generated Body (Gemini API)
The prompt instructs Gemini to write a 4-paragraph executive summary:

**Paragraph 1 — Situation:** Current environment and cost baseline  
**Paragraph 2 — Value:** Total savings, top lever, NPV and payback  
**Paragraph 3 — Strategic fit:** Why Everpure's architecture addresses their specific environment  
**Paragraph 4 — Recommendation:** Clear call to action for the executive reader  

Word count target: 180–220 words. Tone: confident, financial, not promotional.

#### Gemini Prompt Template:
```
You are a Value Consultant at Everpure (formerly Pure Storage), writing an executive summary for a CFO or CIO. Write in a professional, financial tone — confident but not salesy. Do not use bullet points. Write in full paragraphs only.

Customer context:
- Company: {companyName}, {industry} sector, {companySize} organization
- Current storage: {storageTB}TB across legacy arrays
- Refresh cycle: every {refreshCycle} years
- Storage admins: {admins} FTE at {adminCost}/yr

Financial results ({scenario} scenario):
- Total 3-year savings: {totalSavings}
- Top value lever: {topLever} at {topLeverValue}
- NPV (8% discount rate): {npv}
- Payback period: {paybackMonths} months
- ROI: {roi}%

Write a 4-paragraph executive summary (180–220 words total) covering: current situation and cost baseline, total financial value and key drivers, why Everpure's platform addresses this specific environment, and a clear recommendation. Do not mention specific product model names. Do not use bullet points.
```

#### UI States
- **Idle:** "Generate Executive Summary" button centered in left panel
- **Loading:** Animated shimmer on text area, "Analyzing your environment..." copy
- **Generated:** Full text appears, two action buttons below:
  - "Regenerate" (reruns the API call with same inputs)
  - "Copy to Clipboard" (copies formatted text)
- **Error:** "Unable to generate summary. Your financial results are still valid above." — shows the KPI cards only

#### Navigation
- "← Back to Dashboard" button
- "Start New Analysis" button (resets all state, returns to Screen 0)

---

## 3. Financial Model Specification

### 3.1 Input Validation Rules
- All numeric fields: must be > 0
- Storage TB: min 1, max 100,000
- kWh rate: min $0.01, max $0.50
- Refresh cycle: min 1, max 10 years
- FTEs: min 0.1, max 50
- Admin time %: min 1%, max 100%

### 3.2 TCO Model — Full Formulas

**Power & Cooling (Annual):**
```
legacyPowerCost = storageTB × 22.5 × 8760 × kwhRate × 1.4 / 1000
everpurePowerCost = storageTB × 2.5 × 8760 × kwhRate × 1.4 / 1000
powerSavings = legacyPowerCost - everpurePowerCost
```

**Refresh Avoidance (Annual):**
```
refreshCostPerCycle = (arrayPricePerTB × storageTB × 0.80) + migrationLaborCost
annualRefreshCost = refreshCostPerCycle / refreshCycleYears
refreshSavings = annualRefreshCost  // Everpure cost = $0 via Evergreen
```

**Admin Labor Reduction (Annual):**
```
currentAdminCost = adminFTEs × adminFullyLoadedCost × (adminTimePct / 100)
adminSavings = currentAdminCost × 0.32
```

**Downtime Risk Mitigation (Annual):**
```
legacyDowntimeHours = 4.38   // 99.99% availability = 52.6 min/yr
everpureDowntimeHours = 0.0526  // 99.9999% availability = ~3.16 min/yr
downtimeSavings = (legacyDowntimeHours - everpureDowntimeHours) × downtimeCostPerHour
```

**Total Annual Savings:**
```
annualSavings = powerSavings + refreshSavings + adminSavings + downtimeSavings
```

**3-Year Totals with Scenario Multipliers:**
```
scenarioMultiplier = { conservative: 0.60, base: 1.00, optimistic: 1.25 }
totalSavings3yr = annualSavings × 3 × scenarioMultiplier
```

**NPV (8% discount rate):**
```
npv = (annualSavings × scenarioMultiplier / 1.08)
    + (annualSavings × scenarioMultiplier / 1.08²)
    + (annualSavings × scenarioMultiplier / 1.08³)
```

**Everpure Premium (estimated 25% over legacy):**
```
legacyArrayCost = arrayPricePerTB × storageTB
everpurePremium = legacyArrayCost × 0.25
```

**Payback Period (months):**
```
paybackMonths = (everpurePremium / (annualSavings × scenarioMultiplier)) × 12
```

**ROI:**
```
roi = ((totalSavings3yr - everpurePremium) / everpurePremium) × 100
```

### 3.3 Assumption Sources
| Assumption | Value | Source |
|---|---|---|
| Legacy power draw | 22.5 W/TB | Industry average for hybrid/SAS arrays |
| Everpure power draw | 2.5 W/TB | Everpure published DirectFlash specs |
| Cooling multiplier | 1.4x | Standard data center PUE delta |
| Refresh hardware cost | 80% of original | Industry standard forklift estimate |
| Admin labor reduction | 32% | ESG Economic Validation of Pure1, 2024 |
| Legacy availability | 99.99% = 4.38 hrs/yr | Standard SLA for legacy enterprise arrays |
| Everpure availability | 99.9999% = 0.053 hrs/yr | Everpure SLA commitment |
| Discount rate | 8% | Standard enterprise hurdle rate |
| Everpure premium | 25% over legacy | Conservative blended estimate |

---

## 4. Non-Functional Requirements

### 4.1 Performance
- TCO calculations must update in real-time as inputs change (no submit button for recalculation)
- Gemini API call must show loading state within 200ms of button click
- App must be fully interactive within 2 seconds of page load

### 4.2 Design
- Primary color: Navy #1A2744
- Accent color: Orange #F97316
- Background: #0F172A (dark slate)
- Card background: #1E293B
- Text primary: #F8FAFC
- Text secondary: #94A3B8
- Font: Inter (Google Fonts)
- All monetary values formatted with commas and $ prefix (e.g., $1,234,567)
- Negative values (savings) displayed in orange, not red

### 4.3 Constraints
- No backend required — all computation runs client-side
- Gemini API key stored in .env as VITE_GEMINI_API_KEY
- No user authentication
- No data persistence between sessions
- Desktop-optimized (min-width: 1024px), graceful degradation on mobile

---

## 5. Out of Scope (V1)
- PDF export
- Shareable URLs
- User accounts or saved analyses
- Backend API
- Multi-currency support
- Integration with CRM data
