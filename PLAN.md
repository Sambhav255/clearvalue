# ClearValue — Build Plan for Cursor

**Goal:** Build ClearValue in a logical order so each step is testable before moving to the next. Never build UI before the data model. Never wire up API before the UI renders correctly with mock data.

**Stack:** React 18 + TypeScript + Vite + Tailwind + Recharts + Gemini API + React Router v6  
**Deploy:** Vercel  
**Time estimate:** 1–2 days

---

## Rules for Cursor Sessions

1. **Always reference PRD.md for requirements.** If Cursor suggests something not in the PRD, push back.
2. **Always reference TECH_STACK.md for library choices.** Do not let Cursor introduce new dependencies.
3. **Build one phase at a time.** Do not start Phase 3 until Phase 2 is visually confirmed working.
4. **tcoModel.ts is sacred.** All financial formulas live only here. No calculations in components.
5. **No inline styles.** Tailwind classes only. Use the custom color tokens defined in tailwind.config.ts.
6. **TypeScript strict mode.** No `any` types. All interfaces defined in types/index.ts.

---

## Phase 0 — Project Scaffold
**Prompt for Cursor:**
> "Scaffold a new Vite + React + TypeScript project called clearvalue. Install: react-router-dom@6, recharts, lucide-react, @radix-ui/react-tooltip, tailwindcss, autoprefixer, postcss. Configure Tailwind with the custom color tokens from TECH_STACK.md. Set up the folder structure exactly as defined in TECH_STACK.md. Create empty placeholder files for every file in the structure. Create .env.example with VITE_GEMINI_API_KEY=your_key_here. Do not write any component logic yet — just the scaffold."

**Confirm before moving on:**
- [ ] `npm run dev` starts without errors
- [ ] Tailwind custom colors resolve (test with a `bg-navy-900` class)
- [ ] All placeholder files exist

---

## Phase 1 — Types & Financial Model
**Why first:** Everything else depends on this. Get the math right before building any UI.

**Prompt for Cursor:**
> "Using the PRD.md as the source of truth, implement the following files with no UI components:
>
> 1. src/types/index.ts — Define these interfaces: UserInputs (all Screen 1 fields with their types), TCOResults (all computed outputs: powerSavings, refreshSavings, adminSavings, downtimeSavings, annualSavings, totalSavings3yr, npv, paybackMonths, roi, topLever, topLeverValue), ScenarioType ('conservative' | 'base' | 'optimistic'), CompanySize ('smb' | 'midmarket' | 'enterprise').
>
> 2. src/lib/benchmarks.ts — Implement the three company size presets exactly as defined in PRD.md Section 2, Screen 1. Export as PRESETS object keyed by CompanySize.
>
> 3. src/lib/tcoModel.ts — Implement the calculateTCO(inputs: UserInputs, scenario: ScenarioType): TCOResults function using the exact formulas from PRD.md Section 3.2. This must be a pure function with no side effects. Export it as the default export.
>
> 4. src/lib/formatters.ts — Implement formatCurrency and formatCurrencyFull as defined in TECH_STACK.md."

**Confirm before moving on:**
- [ ] No TypeScript errors
- [ ] Manually test calculateTCO with mid-market defaults in browser console — total savings should be roughly $800K–$1.2M/yr
- [ ] formatCurrency(1500000) returns '$1.5M'
- [ ] formatCurrency(45000) returns '$45K'

---

## Phase 2 — Context & State
**Prompt for Cursor:**
> "Implement two React contexts:
>
> 1. src/context/InputContext.tsx — Stores UserInputs state. Provides: inputs (UserInputs with all fields defaulting to mid-market preset values), setInputs, updateField(field: keyof UserInputs, value: number | string), applyPreset(size: CompanySize). Wrap with React.createContext and export useInputs hook.
>
> 2. src/context/ResultsContext.tsx — Derives TCOResults from InputContext using useMemo. Stores: results (TCOResults), scenario (ScenarioType, default 'base'), setScenario. Calls calculateTCO(inputs, scenario) reactively. Export useResults hook.
>
> 3. src/App.tsx — Wrap the app in both providers. Set up React Router with four routes: / (LandingScreen), /inputs (InputsScreen), /dashboard (DashboardScreen), /summary (SummaryScreen). Add a navigation guard: if user navigates to /dashboard or /summary and inputs.storageTB is 0, redirect to /inputs."

**Confirm before moving on:**
- [ ] No TypeScript errors
- [ ] In a test component, calling useResults() returns a TCOResults object with non-zero values
- [ ] applyPreset('enterprise') updates all fields correctly

---

## Phase 3 — UI Components (Shared)
**Prompt for Cursor:**
> "Build the shared UI components. Use only Tailwind classes. Use the navy/orange color tokens. Do not add any new dependencies.
>
> 1. src/components/ui/Button.tsx — Props: variant ('primary' | 'secondary' | 'ghost'), size ('sm' | 'md' | 'lg'), disabled, onClick, children. Primary: bg-orange-500 hover:bg-orange-400. Secondary: border border-slate-400 text-slate-100. Ghost: text-slate-400 hover:text-slate-100.
>
> 2. src/components/ui/Card.tsx — Dark card wrapper. bg-navy-700 rounded-xl p-6. Props: children, className (for overrides).
>
> 3. src/components/ui/KPICard.tsx — Props: label, value (string), subtitle (optional string), accent (boolean — if true, value text is orange-500). Used for the 4 summary metric cards on Screen 2.
>
> 4. src/components/ui/Tooltip.tsx — Wraps @radix-ui/react-tooltip. Props: content (string), children. Dark tooltip bg-navy-800 text-slate-100 text-xs rounded px-2 py-1. Used for assumption tooltips.
>
> 5. src/components/ui/StepIndicator.tsx — Shows 4 steps (Landing, Inputs, Dashboard, Summary). Highlights current step. Uses current route to determine active step."

**Confirm before moving on:**
- [ ] Render each component in isolation in a test route — all look correct
- [ ] Tooltip opens and closes on hover
- [ ] KPICard with accent=true shows orange value

---

## Phase 4 — Screen 0: Landing Page
**Prompt for Cursor:**
> "Build src/components/screens/LandingScreen.tsx. Requirements from PRD.md Screen 0:
> - Full viewport dark navy background (bg-navy-900)
> - ClearValue logo text (bold, white, large) + tagline: 'Translate infrastructure decisions into financial outcomes.'
> - Subheading: 'Build a defensible, CFO-ready business case in under 3 minutes.'
> - Primary CTA Button ('Build Your Value Case →') that navigates to /inputs using useNavigate
> - Three value prop items below the fold, horizontally laid out, each with a Lucide icon + one line of text: 'Four value levers modeled automatically', 'AI-generated executive summary', 'Audit-ready assumptions on every number'
> - Footer: 'Built by Sambhav Lamichhane'
> - No inputs, no forms on this screen"

**Confirm before moving on:**
- [ ] Page renders correctly, looks like a product landing page
- [ ] CTA button navigates to /inputs

---

## Phase 5 — Screen 1: Inputs
**Prompt for Cursor:**
> "Build src/components/screens/InputsScreen.tsx. Requirements from PRD.md Screen 1:
>
> Section A — Company Profile:
> - Text input for Company Name (updates inputs.companyName)
> - Dropdown for Industry with options: Technology, Financial Services, Healthcare, Manufacturing, Retail, Government, Other
> - Three preset buttons: SMB / Mid-Market / Enterprise. Clicking one calls applyPreset() from InputContext. Active preset highlighted in orange.
>
> Section B — Current Storage Environment:
> - storageTB: number input with label 'Total Storage (TB)' + Tooltip with assumption text from PRD
> - arrayPricePerTB: number input '$' prefix + Tooltip
> - refreshCycleYears: number input + Tooltip
> - migrationLaborCost: number input '$' prefix + Tooltip
>
> Section C — Operational Inputs:
> - kwhRate: number input '$' prefix + Tooltip
> - adminFTEs: number input + Tooltip
> - adminFullyLoadedCost: number input '$' prefix + Tooltip
> - adminTimePct: range slider 0–100 with % display + Tooltip
> - downtimeCostPerHour: number input '$' prefix + Tooltip
>
> All inputs bound to InputContext via updateField().
> 'Calculate Value →' button navigates to /dashboard. Disabled if storageTB is 0.
> Use Card components to visually group the three sections."

**Confirm before moving on:**
- [ ] All inputs update InputContext correctly
- [ ] Preset buttons autofill all fields
- [ ] User can override preset values after applying
- [ ] Navigate to /dashboard and useResults() shows updated calculations

---

## Phase 6 — Screen 2: Dashboard
**Build charts first, then assemble the screen.**

**Step 6a — Charts:**
> "Build src/components/charts/ComparisonBarChart.tsx:
> - Uses Recharts BarChart
> - Grouped bars: two bars per category (Legacy in gray #6B7280, Everpure in orange #F97316)
> - Four categories: Power/Cooling, Refresh Avoidance, Admin Labor, Downtime Risk
> - Data comes from useResults() — 3-year totals per lever for both legacy and Everpure
> - X-axis: category names. Y-axis: dollar values using formatCurrency
> - Custom tooltip showing exact dollar values on hover
> - Legend: 'Legacy (3yr)' and 'Everpure (3yr)'"

**Step 6b — Dashboard Screen:**
> "Build src/components/screens/DashboardScreen.tsx. Requirements from PRD.md Screen 2:
>
> Section A — Four KPICards in a row: Total 3-Year Savings, NPV, Payback Period (in months), ROI (%). All values from useResults(). Savings and NPV in orange accent.
>
> Section B — Scenario Toggle: three tab buttons 'Conservative | Base | Optimistic'. Clicking updates scenario in ResultsContext. Active tab highlighted orange. All cards and charts update reactively.
>
> Section C — ComparisonBarChart (full width)
>
> Section D — Four value lever cards in a 2x2 grid. Each card shows: lever name, Lucide icon, annual savings (formatCurrencyFull), 3-year savings, one sentence description, Tooltip with full assumption text from PRD Section 3.2.
>
> Navigation: '← Edit Inputs' button (navigate to /inputs), 'Generate Executive Summary →' button (navigate to /summary)"

**Confirm before moving on:**
- [ ] All four KPI cards show correct values
- [ ] Scenario toggle changes all numbers reactively
- [ ] Charts render with correct data
- [ ] Tooltips open with assumption text
- [ ] Navigation works both directions

---

## Phase 7 — Screen 3: AI Summary
**Prompt for Cursor:**
> "Build src/lib/geminiApi.ts first:
> - Import VITE_GEMINI_API_KEY from import.meta.env
> - Export interface SummaryParams with all fields needed for the prompt (from PRD Section 2, Screen 3)
> - Implement buildPrompt(params: SummaryParams): string using the exact prompt template from PRD Section 2, Screen 3
> - Implement generateExecutiveSummary(params: SummaryParams): Promise<string> using native fetch as defined in TECH_STACK.md
> - Handle errors: if fetch fails or response malformed, throw Error('GENERATION_FAILED')
>
> Then build src/components/screens/SummaryScreen.tsx:
> - Left panel (60%): static header block with company name, industry, date, scenario. Below: idle state shows 'Generate Executive Summary' button. Loading state shows shimmer animation + 'Analyzing your environment...' text. Generated state shows formatted paragraph text. Error state shows fallback message.
> - Right panel (40%): four KPICards (smaller size) recapping the key numbers from useResults()
> - Below generated text: 'Regenerate' button and 'Copy to Clipboard' button (uses navigator.clipboard.writeText)
> - Bottom navigation: '← Back to Dashboard' and 'Start New Analysis' (resets context, navigates to /)"

**Confirm before moving on:**
- [ ] Gemini API call returns text with a valid API key
- [ ] Loading shimmer shows during API call
- [ ] Generated text appears correctly formatted
- [ ] Copy to clipboard works
- [ ] Error state renders correctly when API key is missing

---

## Phase 8 — Polish & Deploy

**Step 8a — Visual polish:**
> "Do a full visual pass on all four screens:
> - Ensure consistent spacing (use Tailwind spacing scale, no arbitrary values)
> - StepIndicator visible on Screens 1–3 (not on Landing)
> - All monetary values use formatCurrencyFull for full precision display, formatCurrency for chart axis labels
> - Ensure the orange CTA buttons have hover transitions (transition-colors duration-200)
> - Ensure all cards have consistent border-radius and shadow (shadow-lg)
> - Check that the dashboard screen doesn't require vertical scrolling on a 1440px wide screen"

**Step 8b — Error & edge cases:**
> "Add input validation to InputsScreen:
> - Show inline error message if any required field is 0 when user tries to proceed
> - Clamp all slider values to their min/max from PRD Section 3.1
> - If payback period calculation results in Infinity (zero savings), display 'N/A' not a number error"

**Step 8c — Deploy:**
```bash
# 1. Create GitHub repo: clearvalue
# 2. Push code
git init
git add .
git commit -m "Initial build — ClearValue v1"
git remote add origin https://github.com/yourusername/clearvalue.git
git push -u origin main

# 3. Go to vercel.com → Import project → Select clearvalue repo
# 4. Add environment variable: VITE_GEMINI_API_KEY = your_key
# 5. Deploy
```

**Final checklist before the recruiter call:**
- [ ] Landing page loads cleanly
- [ ] Mid-market preset fills all fields in one click
- [ ] Dashboard shows four non-zero KPI cards
- [ ] Scenario toggle changes numbers reactively
- [ ] Assumption tooltips open correctly
- [ ] Gemini summary generates in < 10 seconds
- [ ] Copy to clipboard works
- [ ] "← Edit Inputs" preserves all previously entered values
- [ ] App deployed on Vercel with public URL ready to share

---

## Talking Points for the Recruiter Demo

**Opening line (say this before showing the tool):**
> "I was thinking about what makes the Value Consultant role hard at scale — specifically, that value conversations happen reactively rather than proactively. So I built a quick prototype of what a self-serve first-pass tool could look like."

**Then:**
1. Click "Build Your Value Case →"
2. Click "Mid-Market" preset — watch all fields fill
3. Click "Calculate Value →"
4. Point to the scenario toggle — "Conservative, Base, Optimistic — same idea as sensitivity analysis"
5. Hover a tooltip — "All assumptions are sourced and auditable"
6. Click "Generate Executive Summary" — let it generate
7. "This is what a sales rep could paste into an email before a VC even gets pulled in"

**Stop there. Do not over-explain.**
