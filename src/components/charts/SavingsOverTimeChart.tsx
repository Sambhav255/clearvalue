import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useResults } from '../../context/ResultsContext'
import { useSettings } from '../../context/SettingsContext'
import { formatCurrencyFull } from '../../lib/formatters'

/** Build data points for cumulative savings over 36 months and breakeven. */
function buildSavingsData(
  monthlySavings: number,
  everpurePremium: number
): Array<{ month: number; cumulativeSavings: number; premium: number }> {
  const points: Array<{ month: number; cumulativeSavings: number; premium: number }> = []
  for (let month = 0; month <= 36; month += 6) {
    const cumulativeSavings = monthlySavings * month
    points.push({
      month,
      cumulativeSavings,
      premium: everpurePremium,
    })
  }
  return points
}

export function SavingsOverTimeChart(): JSX.Element {
  const { results, scenario } = useResults()
  const { currency } = useSettings()

  const mult = scenario === 'conservative' ? 0.6 : scenario === 'optimistic' ? 1.25 : 1
  const annualSavingsAdjusted = results.annualSavings * mult
  const monthlySavings = annualSavingsAdjusted / 12
  const data = buildSavingsData(monthlySavings, results.everpurePremium)
  const paybackMonth =
    monthlySavings > 0 ? results.everpurePremium / monthlySavings : Infinity
  const premiumLabel = `Everpure Investment: ${formatCurrencyFull(results.everpurePremium, currency)}`

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            dataKey="month"
            type="number"
            domain={[0, 36]}
            tickFormatter={(v) => `${v} mo`}
            tick={{ fill: 'var(--chart-tick)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--chart-axis)' }}
          />
          <YAxis
            tickFormatter={(v) => formatCurrencyFull(v, currency)}
            tick={{ fill: 'var(--chart-tick)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--chart-axis)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
              color: 'var(--tooltip-text)',
            }}
            formatter={(value: number) => formatCurrencyFull(value, currency)}
            labelFormatter={(label) => `Month ${label}`}
          />
          <ReferenceLine
            y={results.everpurePremium}
            stroke="#C84B0C"
            strokeDasharray="4 4"
            strokeWidth={2}
            strokeOpacity={0.6}
            label={{
              value: premiumLabel,
              position: 'right',
              fill: '#C84B0C',
              fontSize: 12,
            }}
          />
          {Number.isFinite(paybackMonth) && paybackMonth > 0 && paybackMonth <= 36 && (
            <>
              <ReferenceLine
                x={paybackMonth}
                stroke="#C84B0C"
                strokeDasharray="3 3"
                strokeWidth={1.5}
                label={{
                  value: `Payback: ${Math.round(paybackMonth)} mo`,
                  position: 'top',
                  fill: '#C84B0C',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              />
              <ReferenceDot
                x={paybackMonth}
                y={results.everpurePremium}
                r={5}
                fill="#C84B0C"
                stroke="#C84B0C"
              />
            </>
          )}
          <Area
            type="monotone"
            dataKey="cumulativeSavings"
            name="Cumulative Savings"
            stroke="var(--chart-everpure)"
            fill="var(--chart-everpure)"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="premium"
            name="Everpure Premium"
            stroke="var(--chart-legacy)"
            strokeDasharray="4 4"
            dot={false}
            strokeWidth={1.5}
          />
          <Legend
            wrapperStyle={{ paddingTop: '8px' }}
            formatter={(value) => (
              <span className="text-sm text-brand-textSecondary">{value}</span>
            )}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
