import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useResults } from '../../context/ResultsContext'
import { useSettings } from '../../context/SettingsContext'
import { formatCurrency, formatCurrencyFull } from '../../lib/formatters'

type ChartViewMode = 'annual' | '3yr'

interface ComparisonBarChartProps {
  viewMode?: ChartViewMode
}

export function ComparisonBarChart({
  viewMode = '3yr',
}: ComparisonBarChartProps): JSX.Element {
  const { results } = useResults()
  const { currency } = useSettings()

  const divisor = viewMode === 'annual' ? 3 : 1
  const data = [
    {
      name: 'Power/Cooling',
      legacy: results.legacy3yrPower / divisor,
      everpure: results.everpure3yrPower / divisor,
    },
    {
      name: 'Refresh Avoidance',
      legacy: results.legacy3yrRefresh / divisor,
      everpure: results.everpure3yrRefresh / divisor,
    },
    {
      name: 'Admin Labor',
      legacy: results.legacy3yrAdmin / divisor,
      everpure: results.everpure3yrAdmin / divisor,
    },
    {
      name: 'Downtime Risk',
      legacy: results.legacy3yrDowntime / divisor,
      everpure: results.everpure3yrDowntime / divisor,
    },
  ]

  const suffix = viewMode === 'annual' ? ' (yr)' : ' (3yr)'

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid)"
          />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--chart-tick)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--chart-axis)' }}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v, currency)}
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
            labelStyle={{ color: 'var(--tooltip-text)' }}
            formatter={(value: number, name: string) => [
              formatCurrencyFull(value, currency),
              name === 'legacy' ? `Legacy${suffix}` : `Everpure${suffix}`,
            ]}
            labelFormatter={(label) => `${label}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '8px' }}
            formatter={(value) => (
              <span className="text-sm text-brand-textSecondary">
                {value === 'legacy' ? `Legacy${suffix}` : `Everpure${suffix}`}
              </span>
            )}
          />
          <Bar
            dataKey="legacy"
            name="legacy"
            fill="var(--chart-legacy)"
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="everpure"
            name="everpure"
            fill="var(--chart-everpure)"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
