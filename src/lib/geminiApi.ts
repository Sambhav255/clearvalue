import type { ScenarioType } from '../types'
import { formatCurrencyFull } from './formatters'

export interface SummaryParams {
  companyName: string
  industry: string
  companySize: string
  storageTB: number
  refreshCycle: number
  admins: number
  adminCost: number
  scenario: ScenarioType
  totalSavings: number
  topLever: string
  topLeverValue: number
  npv: number
  paybackMonths: number
  roi: number
}

export function buildPrompt(params: SummaryParams): string {
  const scenarioLabel =
    params.scenario === 'conservative'
      ? 'Conservative'
      : params.scenario === 'optimistic'
        ? 'Optimistic'
        : 'Base'
  const paybackStr =
    params.paybackMonths === Infinity || !Number.isFinite(params.paybackMonths)
      ? 'N/A'
      : `${Math.round(params.paybackMonths)}`

  return `You are a Value Consultant at Everpure (formerly Pure Storage), writing an executive summary for a CFO or CIO. Write in a professional, financial tone — confident but not salesy. Do not use bullet points. Write in full paragraphs only.

Customer context:
- Company: ${params.companyName}, ${params.industry} sector, ${params.companySize} organization
- Current storage: ${params.storageTB}TB across legacy arrays
- Refresh cycle: every ${params.refreshCycle} years
- Storage admins: ${params.admins} FTE at ${formatCurrencyFull(params.adminCost)}/yr

Financial results (${scenarioLabel} scenario):
- Total 3-year savings: ${formatCurrencyFull(params.totalSavings)}
- Top value lever: ${params.topLever} at ${formatCurrencyFull(params.topLeverValue)}
- NPV (8% discount rate): ${formatCurrencyFull(params.npv)}
- Payback period: ${paybackStr} months
- ROI: ${params.roi.toFixed(1)}%

Write a 4-paragraph executive summary (180–220 words total) covering: current situation and cost baseline, total financial value and key drivers, why Everpure's platform addresses this specific environment, and a clear recommendation. Do not mention specific product model names. Do not use bullet points.`
}

function getGeminiEndpoint(): string {
  const key = import.meta.env.VITE_GEMINI_API_KEY
  if (typeof key !== 'string' || key.trim() === '' || key === 'your_key_here') {
    throw new Error('GENERATION_FAILED')
  }
  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`
}

export async function generateExecutiveSummary(
  params: SummaryParams
): Promise<string> {
  const endpoint = getGeminiEndpoint()
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(params) }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 400,
      },
    }),
  })

  if (!response.ok) {
    throw new Error('GENERATION_FAILED')
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> }
    }>
  }

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (text == null || text === '') {
    throw new Error('GENERATION_FAILED')
  }
  return text
}
