import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useInputs } from '../../context/InputContext'
import { useResults } from '../../context/ResultsContext'
import { useSettings } from '../../context/SettingsContext'
import { formatCurrency, formatCurrencyFull } from '../../lib/formatters'
import type { ScenarioType } from '../../types'
import { ChevronDown, ChevronUp } from 'lucide-react'

type SourceRow =
  | {
      label: string
      badge: 'published'
      linkText: string
      href: string
      note?: string
    }
  | {
      label: string
      badge: 'published'
      sourceText: string
    }
  | {
      label: string
      badge: 'published'
      customContent: ReactNode
    }
  | {
      label: string
      badge: 'industry'
      sourceText: string
      linkText?: string
      href?: string
    }

function SourcesBlock({
  rows,
  linkClass,
}: {
  rows: SourceRow[]
  linkClass: string
}): JSX.Element {
  return (
    <>
      <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-brand-navy">
        Sources & Assumptions
      </h3>
      <div className="space-y-0">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex flex-wrap items-start gap-3 border-b border-brand-cardBorder py-2 text-sm last:border-0"
          >
            <span className="shrink-0 font-medium text-brand-navy">
              {row.label}
            </span>
            <span
              className={
                row.badge === 'published'
                  ? 'shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800'
                  : 'shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800'
              }
            >
              {row.badge === 'published' ? 'Published Source' : 'Industry Estimate'}
            </span>
            <div className="min-w-0 flex-1">
              {row.badge === 'published' ? (
                <div>
                  {'customContent' in row && row.customContent != null ? (
                    row.customContent
                  ) : 'linkText' in row && row.linkText != null ? (
                    <>
                      <a
                        href={row.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {row.linkText}
                      </a>
                      {'note' in row && row.note != null && (
                        <p className="mt-1 text-xs text-brand-textMuted">
                          {row.note}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-brand-textSecondary">
                      {'sourceText' in row ? row.sourceText : ''}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-brand-textSecondary">{row.sourceText}</p>
                  {row.linkText != null && row.href != null && (
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-1 block ${linkClass}`}
                    >
                      {row.linkText}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

const SCENARIO_MULTIPLIER: Record<ScenarioType, number> = {
  conservative: 0.6,
  base: 1.0,
  optimistic: 1.25,
}

type AboutTab = 'why' | 'problem' | 'math'

const TABS: { id: AboutTab; label: string }[] = [
  { id: 'why', label: 'Why I Built This' },
  { id: 'problem', label: 'The Problem' },
  { id: 'math', label: 'The Math' },
]

export function AboutScreen(): JSX.Element {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AboutTab>('why')
  const [openAccordion, setOpenAccordion] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-brand-bg px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          ← Back
        </Button>

        <h1 className="text-3xl font-bold text-brand-navy">About ClearValue</h1>
        <p className="mt-1 text-sm text-brand-textSecondary">
          Built by Sambhav Lamichhane · March 2026
        </p>

        <div className="mt-6 flex flex-wrap gap-2 overflow-x-auto sm:flex-nowrap">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-brand-orange text-white'
                  : 'border border-brand-border text-brand-textSecondary hover:border-brand-orange hover:text-brand-orange'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === 'why' && <WhyTab />}
          {activeTab === 'problem' && <ProblemTab />}
          {activeTab === 'math' && (
            <MathTab
              openAccordion={openAccordion}
              setOpenAccordion={setOpenAccordion}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function WhyTab(): JSX.Element {
  const cards = [
    {
      title: 'I read the job description differently',
      body:
        "Most people read 'Optimize our library of reusable benchmarks and modeling templates' as a task. I read it as a product problem. The GVM team is not just executing value conversations, they are trying to scale them. That is a different challenge, and it is one I actually know how to think about.",
    },
    {
      title: 'So I stress-tested my own understanding',
      body:
        "The fastest way to find out if you understand something is to build it. I spent a weekend modeling Everpure's four core value levers from primary sources including ESG studies, Everpure's own SLA documentation, ITIC downtime benchmarks, and BLS labor data. If my assumptions were wrong, the model would tell me. That process taught me more about this role than any prep document could.",
    },
    {
      title: 'The gap I kept coming back to',
      body:
        "A Value Consultant gets pulled into a deal weeks after it is already in motion. The economic case justifies a decision rather than shaping one. The first discovery call is where the narrative should start, and a sales rep in that conversation needs a tool that gives them financial credibility before a VC is ever involved. ClearValue is a prototype of that tool.",
    },
  ]
  return (
    <div className="space-y-6">
      {cards.map(({ title, body }) => (
        <div
          key={title}
          className="rounded-2xl border border-brand-cardBorder bg-brand-card p-8"
        >
          <h2 className="text-lg font-semibold text-brand-navy">{title}</h2>
          <p className="mt-3 leading-relaxed text-brand-text">{body}</p>
        </div>
      ))}
      <p className="mt-4 text-center text-sm text-brand-textMuted">
        I am not pitching this as production ready. I am sharing it because building it is how I show up when something matters to me.
      </p>
    </div>
  )
}

function ProblemTab(): JSX.Element {
  const problems = [
    {
      num: '01',
      title: 'Value conversations happen too late',
      body:
        "By the time a Value Consultant is pulled in, the customer is already deep in vendor evaluation. By the time they're involved, the economic case is justifying a decision rather than shaping one.",
    },
    {
      num: '02',
      title: 'Benchmark libraries go stale',
      body:
        'Every new product launch makes existing assumptions outdated. Someone has to manually hunt down new benchmarks and update the models. A tool with configurable, sourced assumptions solves this systematically.',
    },
    {
      num: '03',
      title: "The translation gap doesn't scale",
      body:
        'Sales engineers speak in IOPS. CFOs speak in NPV and payback periods. Value Consultants sit in between but cannot be in every conversation.',
    },
    {
      num: '04',
      title: 'Executive summaries are rebuilt from scratch every time',
      body:
        "The narrative structure of a CFO memo is always the same. Only the numbers change. That's exactly the kind of repetitive, high-stakes work that should be automated.",
    },
  ]
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {problems.map(({ num, title, body }) => (
          <div
            key={num}
            className="rounded-2xl border border-brand-cardBorder bg-brand-card p-6"
          >
            <span className="text-4xl font-bold text-brand-orange">{num}</span>
            <h3 className="mt-2 text-lg font-semibold text-brand-navy">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-textSecondary">
              {body}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-brand-border pt-6">
        <div className="rounded-r-xl border-l-4 border-brand-orange bg-brand-orangeLight px-6 py-4">
          <p className="text-brand-text">
            ClearValue addresses all four problems in a single 3-minute workflow.
          </p>
        </div>
      </div>
    </div>
  )
}

function MathTab({
  openAccordion,
  setOpenAccordion,
}: {
  openAccordion: number | null
  setOpenAccordion: (n: number | null) => void
}): JSX.Element {
  const { inputs } = useInputs()
  const { results, scenario } = useResults()
  const { currency } = useSettings()

  const mult = SCENARIO_MULTIPLIER[scenario]
  const scenarioLabel =
    scenario === 'conservative'
      ? 'Conservative'
      : scenario === 'optimistic'
        ? 'Optimistic'
        : 'Base'
  const multiplierText = `${mult}x`

  const legacyPowerDraw = inputs.storageTB * 2.85
  const everpurePowerDraw = inputs.storageTB * 0.11
  const legacyKwh = (legacyPowerDraw * 8760) / 1000
  const everpureKwh = (everpurePowerDraw * 8760) / 1000

  const refreshCostPerCycle =
    inputs.arrayPricePerTB * inputs.storageTB * 2.0 + inputs.migrationLaborCost
  const annualRefreshCost = refreshCostPerCycle / inputs.refreshCycleYears

  const currentAdminCost =
    inputs.adminFTEs *
    inputs.adminFullyLoadedCost *
    (inputs.adminTimePct / 100)
  const reducedAdminCost = currentAdminCost * 0.68

  const levers = [
    {
      id: 0,
      name: 'Power & Cooling Savings',
      savings: results.powerSavings,
      formula: `legacyPowerCost = storageTB × 2.85 W/TB × 8,760 hrs × $/kWh × 1.56
everpurePowerCost = storageTB × 0.11 W/TB × 8,760 hrs × $/kWh × 1.56
annualSavings = legacyPowerCost - everpurePowerCost`,
      assumption:
        "Legacy HDD baseline 2.85W/TB (Western Digital). Everpure FlashArray//E 0.11W/TB (Everpure ESG Report 2024). PUE 1.56x per Uptime Institute Global Data Center Survey 2024.",
      source:
        'Western Digital HDD Energy Efficiency; Everpure ESG Report 2024; Uptime Institute Global Survey 2024',
      worked: (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-cardBorder">
              <th className="py-2 text-left font-medium text-brand-navy"></th>
              <th className="py-2 text-right font-medium text-brand-navy">
                Power Draw (W)
              </th>
              <th className="py-2 text-right font-medium text-brand-navy">
                Annual kWh
              </th>
              <th className="py-2 text-right font-medium text-brand-navy">
                Annual Cost ($)
              </th>
            </tr>
          </thead>
          <tbody className="text-brand-textSecondary">
            <tr className="border-b border-brand-cardBorder">
              <td className="py-2 font-medium text-brand-text">Legacy</td>
              <td className="py-2 text-right">
                {legacyPowerDraw.toLocaleString()}
              </td>
              <td className="py-2 text-right">{legacyKwh.toLocaleString()}</td>
              <td className="py-2 text-right">
                {formatCurrencyFull(results.legacyPowerCost, currency)}
              </td>
            </tr>
            <tr className="border-b border-brand-cardBorder">
              <td className="py-2 font-medium text-brand-text">Everpure</td>
              <td className="py-2 text-right">
                {everpurePowerDraw.toLocaleString()}
              </td>
              <td className="py-2 text-right">{everpureKwh.toLocaleString()}</td>
              <td className="py-2 text-right">
                {formatCurrencyFull(results.everpurePowerCost, currency)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="pt-2 text-right font-semibold text-brand-orange">
                You save: {formatCurrencyFull(results.powerSavings, currency)}/yr
              </td>
            </tr>
          </tfoot>
        </table>
      ),
    },
    {
      id: 1,
      name: 'Refresh & Migration Avoidance',
      savings: results.refreshSavings,
      formula: `refreshCostPerCycle = (arrayPricePerTB × storageTB × 2.00) + migrationLaborCost
annualRefreshCost = refreshCostPerCycle / refreshCycleYears
everpureCost = $0 (covered by Evergreen subscription)
annualSavings = annualRefreshCost`,
      assumption:
        "Migration project expenditures average 200% of original acquisition cost per Hitachi Vantara 2022 TCO study (consultants, internal labor, dual-run costs). IDC 2025: 44% of orgs refresh every 3 years or less. Evergreen eliminates this cost; ESG validated ~$65K saved per avoided cycle.",
      source:
        'Hitachi Vantara Reducing Costs and Risks for Data Migrations (2022); IDC 2025; ESG Evergreen benefits report',
      worked: (
        <div className="space-y-2 text-sm text-brand-textSecondary">
          <p>
            Cycle cost: {formatCurrencyFull(refreshCostPerCycle, currency)} (one-time per{' '}
            {inputs.refreshCycleYears} yr)
          </p>
          <p>Annualized cost: {formatCurrencyFull(annualRefreshCost, currency)}/yr</p>
          <p className="pt-2 font-semibold text-brand-orange">
            You save: {formatCurrencyFull(results.refreshSavings, currency)}/yr
          </p>
        </div>
      ),
    },
    {
      id: 2,
      name: 'Admin Labor Reduction',
      savings: results.adminSavings,
      formula: `currentAdminCost = adminFTEs × fullyLoadedCost × (timePct / 100)
adminSavings = currentAdminCost × 0.32`,
      assumption:
        "Everpure's Pure1 AIOps platform automates predictive analytics, issue prevention, and routine storage management tasks. An independent ESG economic validation found a 32% reduction in storage administration labor for Pure1 customers.",
      source: 'ESG Economic Validation of Pure1 platform, 2024',
      worked: (
        <div className="space-y-2 text-sm text-brand-textSecondary">
          <p>Current cost: {formatCurrencyFull(currentAdminCost, currency)}/yr</p>
          <p>Reduced cost (68%): {formatCurrencyFull(reducedAdminCost, currency)}/yr</p>
          <p className="pt-2 font-semibold text-brand-orange">
            You save: {formatCurrencyFull(results.adminSavings, currency)}/yr
          </p>
        </div>
      ),
    },
    {
      id: 3,
      name: 'Downtime Risk Mitigation',
      savings: results.downtimeSavings,
      formula: `legacyDowntime = 0.876 hours/year  (99.99% availability SLA)
everpureDowntime = 0.00876 hours/year (99.9999% availability SLA)
annualRiskReduction = (0.876 - 0.00876) × downtimeCostPerHour`,
      assumption:
        "99.99% (four nines) = 0.876 hrs/yr = 52.56 min/yr. 99.9999% (six nines) = 0.00876 hrs/yr = 31.54 sec/yr per Evergreen//One Product Guide. Savings = expected value of avoided downtime cost.",
      source:
        'Everpure Evergreen//One Product Guide; arithmetic from availability percentages',
      worked: (
        <div className="space-y-2 text-sm text-brand-textSecondary">
          <p>Legacy downtime: 0.876 hrs/yr (52.56 min)</p>
          <p>Everpure downtime: 0.00876 hrs/yr (31.54 sec)</p>
          <p>Cost per hour: {formatCurrencyFull(inputs.downtimeCostPerHour, currency)}</p>
          <p className="pt-2 font-semibold text-brand-orange">
            You save: {formatCurrencyFull(results.downtimeSavings, currency)}/yr
          </p>
        </div>
      ),
    },
  ]

  const totalAnnual = results.annualSavings
  const total3yr = results.totalSavings3yr

  const linkClass =
    'text-brand-orange underline hover:text-brand-orangeHover text-sm'

  const adminCostTable = (
    <table className="mt-1 w-full max-w-md border-collapse text-xs">
      <thead>
        <tr className="border-b border-brand-cardBorder">
          <th className="py-1.5 text-left font-semibold text-brand-navy">
            Component
          </th>
          <th className="py-1.5 text-left font-semibold text-brand-navy">
            Rate
          </th>
          <th className="py-1.5 text-right font-semibold text-brand-navy">
            Annual Cost
          </th>
          <th className="py-1.5 text-left font-semibold text-brand-navy">
            Source
          </th>
        </tr>
      </thead>
      <tbody className="text-brand-textSecondary">
        <tr className="border-b border-brand-cardBorder">
          <td className="py-1.5">Base salary</td>
          <td className="py-1.5">—</td>
          <td className="py-1.5 text-right">$105,555</td>
          <td className="py-1.5">ZipRecruiter Storage Administrator Salary Report, March 2026</td>
        </tr>
        <tr className="border-b border-brand-cardBorder">
          <td className="py-1.5">Benefits</td>
          <td className="py-1.5">42%</td>
          <td className="py-1.5 text-right">$44,333</td>
          <td className="py-1.5">BLS Employer Costs for Employee Compensation, September 2025</td>
        </tr>
        <tr className="border-b border-brand-cardBorder">
          <td className="py-1.5">Overhead</td>
          <td className="py-1.5">17%</td>
          <td className="py-1.5 text-right">$17,944</td>
          <td className="py-1.5">Federal Register methodology</td>
        </tr>
        <tr>
          <td className="py-1.5 font-semibold text-brand-navy">Total</td>
          <td className="py-1.5">—</td>
          <td className="py-1.5 text-right font-semibold text-brand-navy">
            $167,832
          </td>
          <td className="py-1.5">Fully-loaded annual cost</td>
        </tr>
      </tbody>
    </table>
  )

  const sourcesBlocks: Record<number, JSX.Element> = {
    0: (
      <SourcesBlock
        rows={[
          {
            label: 'Legacy HDD power draw (2.85W/TB baseline)',
            badge: 'published',
            linkText: 'Western Digital HDD Energy Efficiency for Cloud Storage',
            href: 'https://blog.westerndigital.com/hdd-energy-efficiency-cloud-storage/',
            note: 'Traditional air-filled 4TB enterprise drives draw 2.85W/TB (primary source: Western Digital, 2024). Used as the legacy baseline in this model as it represents the most common enterprise storage still being replaced.',
          },
          {
            label: 'Everpure FlashArray//E power draw (0.11W/TB)',
            badge: 'published',
            linkText: 'Everpure ESG Sustainability Report 2024',
            href: 'https://www.purestorage.com/content/dam/pdf/en/misc/esg/2024-esg-pure-report.pdf',
            note: "Everpure's FlashArray//E delivers usable capacity at 0.11W/TB via DirectFlash architecture. DirectFlash uses ~1,000x less DRAM than commodity SSDs, directly reducing heat and power footprint. Everpure claims 39-54% fewer watts per TB than competitors using standard SSDs.",
          },
          {
            label: 'PUE multiplier (1.56x)',
            badge: 'published',
            linkText: 'Uptime Institute Global Data Center Survey 2024',
            href: 'https://uptimeinstitute.com/uptime_assets/7425ec68d479c5d78a743df94a79b114ed9f9c73f13b6460949d2b8e73373209-GA-2024-07-uptime-institute-global-data-center-survey-results-2024.pdf',
            note: "Industry average enterprise data center PUE has remained stable at 1.56-1.58 since 2020 per the Uptime Institute annual survey. Hyperscale leaders achieve 1.08-1.10 but the vast majority of corporate on-premise facilities operate near the 1.56 mark. Using 1.56 is the recommended conservative TCO baseline.",
          },
        ]}
        linkClass={linkClass}
      />
    ),
    1: (
      <SourcesBlock
        rows={[
          {
            label: 'Migration cost = 200% of original acquisition cost',
            badge: 'published',
            linkText:
              'Hitachi Vantara: Reducing Costs and Risks for Data Migrations (2022)',
            href: 'https://www.hitachivantara.com/go/cost-efficiency/pdf/white-paper-reducing-costs-and-risks-for-data-migrations.pdf',
            note: "This is a significant correction from the commonly cited 80% figure. Hitachi Vantara's TCO study found migration project expenditures average 200% of original acquisition cost when including external consultants, internal labor (4-6 hours planning + 1-2 hours per host execution), and dual-run costs while both old and new systems run simultaneously.",
          },
          {
            label: 'Refresh frequency (3-5 year average, 44% refresh every 3 years)',
            badge: 'published',
            linkText: 'IDC Server and Storage Refresh White Paper, 2025',
            href: 'https://www.delltechnologies.com/asset/en-us/products/servers/industry-market/idc-server-refresh-white-paper.pdf',
            note: 'IDC 2025 research indicates 44% of organizations refresh storage infrastructure every three years or less. Default set to 3 years for mid-market and SMB, 4 years for enterprise.',
          },
          {
            label: 'Evergreen eliminates refresh cost + saves ~$65,000 per avoided cycle',
            badge: 'published',
            linkText:
              'ESG: Analyzing the Economic Benefits of the Pure Evergreen Storage Program',
            href: 'https://www.purestorage.com/content/dam/pdf/en/analyst-reports/ar-esg-benefits-of-pure-evergreen-storage-program.pdf',
            note: 'ESG validated that Evergreen extends storage lifecycle to 8-10 years (vs standard 3-5 year refresh cycle), reduces annualized TCO by 30% or more, and saves approximately $65,000 per avoided migration cycle. 74% lower acquisition costs and 58% lower capacity upgrade costs over a 6-year period vs traditional models.',
          },
        ]}
        linkClass={linkClass}
      />
    ),
    2: (
      <SourcesBlock
        rows={[
          {
            label: '32% reduction in storage administration labor',
            badge: 'published',
            linkText:
              'ESG Economic Validation: Analyzing the Economic Benefits of Pure Storage Evergreen//One (2022)',
            href: 'https://www.purestorage.com/content/dam/pdf/en/analyst-reports/ar-esg-economic-benefits-of-pure-evergreen-one.pdf',
            note: 'Based on in-depth interviews with Pure Storage customers. Reduction driven by: (1) Pure1 AI-driven capacity forecasting eliminating manual spreadsheet work, (2) REST API automation of routine provisioning, (3) unified block and file management reducing complexity by 62%. Consistent with Forrester TEI studies showing 20-25% labor productivity gains from automated infrastructure.',
          },
          {
            label: 'Fully-loaded admin cost: $167,832/year',
            badge: 'published',
            customContent: adminCostTable,
          },
        ]}
        linkClass={linkClass}
      />
    ),
    3: (
      <SourcesBlock
        rows={[
          {
            label: 'Downtime costs by company size (2024 research)',
            badge: 'published',
            linkText: 'ITIC 2024 Global Server Hardware and Server OS Reliability Survey',
            href: 'https://thenetworkinstallers.com/blog/cost-of-it-downtime-statistics/',
            note: '2024 figures: SMB (<$50M revenue) = $100,000/hr (ITIC), Mid-Market ($50M-$1B) = $300,000/hr (ITIC), Enterprise (>$1B) = $843,360/hr (EMA), Large Enterprise/Global 2000 = $1,425,000/hr (BigPanda). These are significantly higher than legacy figures — Gartner\'s 2014 figure of $5,600/min has increased to $14,056/min average by 2024.',
          },
          {
            label: 'Legacy availability baseline: 99.99% = 52.56 minutes/year downtime',
            badge: 'published',
            sourceText:
              'Pure arithmetic confirmed by research: (1 - 0.9999) × 8,760 hours = 0.876 hours = 52.56 minutes per year. Note: this model previously used 4.38 hours/year which incorrectly reflected 99.9% (three nines) availability. Corrected to 0.876 hours for 99.99% (four nines) — the standard enterprise storage SLA.',
          },
          {
            label: 'Everpure 99.9999% SLA = 31.54 seconds/year downtime',
            badge: 'published',
            linkText: 'Evergreen//One Product Guide — Everpure SLA Commitment',
            href: 'https://www.purestorage.com/br/legal/evergreen-one-product-guide.html',
            note: 'Everpure formally commits to 99.9999% uptime for FlashArray. Per the Evergreen//One Product Guide, the SLA allows no more than 2.6 seconds of downtime in a completed calendar month. Critically, this includes zero planned downtime for maintenance and upgrades — legacy arrays still require maintenance windows for firmware changes.',
          },
          {
            label: 'Average downtime cost per incident: $505,502',
            badge: 'published',
            linkText: 'Ponemon Institute: Cost of Data Center Outages',
            href: 'https://www.ponemon.org/local/upload/file/2011%20Cost_of_Data_Center_Outages.pdf',
            note: 'Ponemon Institute research confirms the average damage per unplanned incident is $505,502. 20-40% of these costs stem from impact assessment — determining which users are affected and what data has been lost — rather than the actual repair process.',
          },
        ]}
        linkClass={linkClass}
      />
    ),
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 rounded-r-xl border-l-4 border-brand-orange bg-brand-orangeLight px-6 py-4">
        <h2 className="font-semibold text-brand-navy">
          How we built this model
        </h2>
        <p className="mt-2 text-brand-text">
          ClearValue&apos;s financial model is built on published third-party
          research, manufacturer specifications, and independent analyst
          validations. All four value levers use primary sources where
          available. Every assumption is labeled below.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            Published Source
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Industry Estimate
          </span>
        </div>
      </div>

      {levers.map(({ id, name, savings, formula, assumption, source, worked }) => (
        <div
          key={id}
          className="overflow-hidden rounded-2xl border border-brand-cardBorder bg-brand-card"
        >
          <button
            type="button"
            onClick={() =>
              setOpenAccordion(openAccordion === id ? null : id)
            }
            className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-brand-inputBg"
          >
            <span className="font-medium text-brand-navy">{name}</span>
            <span className="flex items-center gap-2 text-brand-orange">
              ~{formatCurrency(savings, currency)}/yr savings
              {openAccordion === id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </span>
          </button>
          {openAccordion === id && (
            <div className="border-t border-brand-cardBorder bg-brand-bg px-6 py-5">
              <pre className="overflow-x-auto rounded-xl bg-brand-inputBg p-4 font-mono text-sm text-brand-text">
                {formula}
              </pre>
              <p className="mt-4 text-sm text-brand-textSecondary">
                <span className="font-medium text-brand-navy">Assumption:</span>{' '}
                {assumption}
              </p>
              <p className="mt-2 text-sm text-brand-textSecondary">
                <span className="font-medium text-brand-navy">Source:</span>{' '}
                {source}
              </p>
              <p className="mt-4 text-sm font-medium text-brand-navy">
                Worked example (your inputs):
              </p>
              <div className="mt-2">{worked}</div>
              {sourcesBlocks[id]}
            </div>
          )}
        </div>
      ))}

      <div className="overflow-hidden rounded-2xl border border-brand-cardBorder bg-brand-card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-brand-navy text-white">
              <th className="px-6 py-3 font-semibold">Lever</th>
              <th className="px-6 py-3 text-right font-semibold">
                Annual Savings
              </th>
              <th className="px-6 py-3 text-right font-semibold">
                3-Year Savings
              </th>
              <th className="px-6 py-3 text-right font-semibold">% of Total</th>
            </tr>
          </thead>
          <tbody>
            {levers.map(({ name, savings }, i) => {
              const threeYr = savings * 3 * mult
              const pct = totalAnnual > 0 ? (savings / totalAnnual) * 100 : 0
              return (
                <tr
                  key={name}
                  className={
                    i % 2 === 0 ? 'bg-white' : 'bg-brand-bg'
                  }
                >
                  <td className="px-6 py-3 text-brand-navy">{name}</td>
                  <td className="px-6 py-3 text-right text-brand-text">
                    {formatCurrencyFull(savings, currency)}
                  </td>
                  <td className="px-6 py-3 text-right text-brand-text">
                    {formatCurrencyFull(threeYr, currency)}
                  </td>
                  <td className="px-6 py-3 text-right text-brand-text">
                    {pct.toFixed(1)}%
                  </td>
                </tr>
              )
            })}
            <tr className="bg-brand-bg font-bold">
              <td className="px-6 py-3 text-brand-navy">Total</td>
              <td className="px-6 py-3 text-right text-brand-orange">
                {formatCurrencyFull(totalAnnual, currency)}
              </td>
              <td className="px-6 py-3 text-right text-brand-orange">
                {formatCurrencyFull(total3yr, currency)}
              </td>
              <td className="px-6 py-3 text-right text-brand-orange">100%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm italic text-brand-textSecondary">
        All values shown using {scenarioLabel} scenario ({multiplierText}{' '}
        multiplier). Change scenario on the Dashboard screen.
      </p>

      <p className="mt-6 text-center text-xs text-brand-textMuted">
        ClearValue is a prototype built to demonstrate value consulting
        methodology. All published sources are third-party research
        independent of Everpure. Industry estimates are clearly labeled
        and would be replaced with customer-specific data and Everpure&apos;s
        internal benchmarks in a production engagement. Built by Sambhav
        Lamichhane, March 2026.
      </p>
    </div>
  )
}
