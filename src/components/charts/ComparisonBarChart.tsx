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
import { formatCurrency, formatCurrencyFull } from '../../lib/formatters'

export function ComparisonBarChart(): JSX.Element {
  const { results } = useResults()

  const data = [
    {
      name: 'Power/Cooling',
      legacy: results.legacy3yrPower,
      everpure: results.everpure3yrPower,
    },
    {
      name: 'Refresh Avoidance',
      legacy: results.legacy3yrRefresh,
      everpure: results.everpure3yrRefresh,
    },
    {
      name: 'Admin Labor',
      legacy: results.legacy3yrAdmin,
      everpure: results.everpure3yrAdmin,
    },
    {
      name: 'Downtime Risk',
      legacy: results.legacy3yrDowntime,
      everpure: results.everpure3yrDowntime,
    },
  ]

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
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fill: 'var(--chart-tick)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--chart-axis)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--tooltip-bg)',
              border: '1px solid var(--tooltip-border)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              color: 'var(--tooltip-text)',
            }}
            labelStyle={{ color: 'var(--tooltip-text)' }}
            formatter={(value: number, name: string) => [
              formatCurrencyFull(value),
              name === 'legacy' ? 'Legacy (3yr)' : 'Everpure (3yr)',
            ]}
            labelFormatter={(label) => `${label}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '8px' }}
            formatter={(value) => (
              <span className="text-sm text-brand-textSecondary">
                {value === 'legacy' ? 'Legacy (3yr)' : 'Everpure (3yr)'}
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
