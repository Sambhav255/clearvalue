import type { ScenarioType } from '../types'
import { formatCurrencyFull } from './formatters'

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'openai/gpt-4.1-mini'

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

Write a 4-paragraph executive summary (180–220 words total) covering: current situation and cost baseline, total financial value and key drivers, why Everpure's platform addresses this specific environment, and a clear recommendation. Explicitly mention the customer's industry (${params.industry}) where relevant so the summary feels tailored to their context. Do not mention specific product model names. Do not use bullet points.`
}

export class SummaryGenerationError extends Error {
  constructor(
    message: string,
    public readonly userMessage: string
  ) {
    super(message)
    this.name = 'SummaryGenerationError'
  }
}

function getOpenRouterKey(): string {
  const key = import.meta.env.VITE_OPENROUTER_API_KEY
  if (typeof key !== 'string' || key.trim() === '' || key === 'your_openrouter_key_here') {
    throw new SummaryGenerationError(
      'Missing or invalid VITE_OPENROUTER_API_KEY',
      'VITE_OPENROUTER_API_KEY is missing or invalid. From `https://openrouter.ai/settings/keys`, copy an API key and set it in .env as VITE_OPENROUTER_API_KEY=sk_..., then fully restart the dev server.'
    )
  }
  return key.trim()
}

export async function generateExecutiveSummary(
  params: SummaryParams
): Promise<string> {
  const apiKey = getOpenRouterKey()
  const prompt = buildPrompt(params)

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'HTTP-Referer': window.location.origin,
    // X-Title must be ISO-8859-1 safe; avoid characters like em dash.
    'X-Title': 'ClearValue Executive Summary',
  }

  // #region agent log
  try {
    const headerInfo = Object.entries(headers).map(([k, v]) => ({
      key: k,
      hasNonLatin1: /[^\u0000-\u00ff]/.test(v),
      length: v.length,
    }))
    fetch('http://127.0.0.1:7549/ingest/3333e265-2fd7-4b40-a746-6557a6836ef1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Debug-Session-Id': '79e41b',
      },
      body: JSON.stringify({
        sessionId: '79e41b',
        runId: 'openrouter-headers',
        hypothesisId: 'A',
        location: 'geminiApi.ts:generateExecutiveSummary:headers',
        message: 'OpenRouter fetch headers inspection',
        data: { headerInfo },
        timestamp: Date.now(),
      }),
    }).catch(() => {})
  } catch {
    // ignore logging failures
  }
  // #endregion

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 400,
      temperature: 0.4,
    }),
  })

  if (!response.ok) {
    let detail = response.statusText
    try {
      const raw = await response.text()
      const parsed = JSON.parse(raw) as { error?: { message?: string } | string }
      if (typeof parsed.error === 'string') detail = parsed.error
      else if (typeof parsed.error === 'object' && parsed.error?.message) {
        detail = parsed.error.message
      }
    } catch {
      // ignore parse failure
    }

    let userMessage = `API error (${response.status}).`
    if (response.status === 401 || response.status === 403) {
      userMessage =
        'OpenRouter rejected the API key. Double-check VITE_OPENROUTER_API_KEY in .env and that the key is active on `https://openrouter.ai/settings/keys`.'
    } else if (response.status === 429) {
      userMessage = 'OpenRouter rate limit or quota exceeded. Try again in a minute.'
    }

    throw new SummaryGenerationError(
      `OpenRouter chat ${response.status}: ${detail}`,
      userMessage
    )
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const text = data.choices?.[0]?.message?.content?.trim()
  if (!text) {
    throw new SummaryGenerationError(
      'No text in OpenRouter response',
      'Summary could not be generated. Try again.'
    )
  }
  return text
}

// summarizeText is unused in the current app; kept as a stub to avoid breaking imports if added later.
export async function summarizeText(longText: string): Promise<string> {
  return longText
}
