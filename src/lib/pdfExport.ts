import { jsPDF } from 'jspdf'
import type { CurrencyCode } from '../types'
import type { TCOResults } from '../types'
import { formatCurrencyFull } from './formatters'

interface PDFExportParams {
  companyName: string
  industry: string
  scenarioLabel: string
  dateStr: string
  results: TCOResults
  currency: CurrencyCode
  generatedMemo: string
}

const MARGIN = 20
const PAGE_WIDTH = 210
const LINE_HEIGHT = 6

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number = LINE_HEIGHT
): number {
  const lines = doc.splitTextToSize(text, maxWidth)
  doc.text(lines, x, y)
  return y + lines.length * lineHeight
}

export function downloadPDFReport(params: PDFExportParams): void {
  const {
    companyName,
    industry,
    scenarioLabel,
    dateStr,
    results,
    currency,
    generatedMemo,
  } = params

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  let y = MARGIN

  // ----- Page 1: Header + KPIs + TCO summary -----
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Everpure Platform — Value Assessment', MARGIN, y)
  y += 10

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  y = addWrappedText(
    doc,
    `Prepared for: ${companyName}  |  ${industry}  |  ${dateStr}`,
    MARGIN,
    y,
    PAGE_WIDTH - 2 * MARGIN
  )
  y = addWrappedText(doc, `Scenario: ${scenarioLabel}`, MARGIN, y, PAGE_WIDTH - 2 * MARGIN)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('Key Metrics', MARGIN, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const paybackStr =
    results.paybackMonths === Infinity || !Number.isFinite(results.paybackMonths)
      ? 'N/A'
      : `${Math.round(results.paybackMonths)} months`
  const metrics = [
    `Total 3-Year Savings: ${formatCurrencyFull(results.totalSavings3yr, currency)}`,
    `NPV (8% discount rate): ${formatCurrencyFull(results.npv, currency)}`,
    `Payback Period: ${paybackStr}`,
    `ROI: ${results.roi.toFixed(1)}%`,
  ]
  metrics.forEach((line) => {
    doc.text(line, MARGIN, y)
    y += LINE_HEIGHT
  })
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Value Lever Summary (Annual)', MARGIN, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  const levers = [
    `Power & Cooling: ${formatCurrencyFull(results.powerSavings, currency)}/yr`,
    `Refresh & Migration Avoidance: ${formatCurrencyFull(results.refreshSavings, currency)}/yr`,
    `Admin Labor Reduction: ${formatCurrencyFull(results.adminSavings, currency)}/yr`,
    `Downtime Risk Mitigation: ${formatCurrencyFull(results.downtimeSavings, currency)}/yr`,
  ]
  levers.forEach((line) => {
    doc.text(line, MARGIN, y)
    y += LINE_HEIGHT
  })
  y += 4
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(
    'Full interactive charts available in the ClearValue web app.',
    MARGIN,
    y
  )
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)

  // ----- Page 2: Executive Summary -----
  doc.addPage()
  y = MARGIN
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Executive Summary', MARGIN, y)
  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  y = addWrappedText(
    doc,
    generatedMemo || 'Executive summary not yet generated. Complete the analysis on the Summary screen and click Generate Executive Summary to populate this section with an AI-generated CFO-ready narrative.',
    MARGIN,
    y,
    PAGE_WIDTH - 2 * MARGIN,
    5.5
  )
  y += 10
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(
    'ClearValue — Translate infrastructure decisions into financial outcomes.',
    MARGIN,
    doc.internal.pageSize.height - 10
  )
  doc.setTextColor(0, 0, 0)

  doc.save(`ClearValue-ValueAssessment-${companyName.replace(/\s+/g, '-')}.pdf`)
}
