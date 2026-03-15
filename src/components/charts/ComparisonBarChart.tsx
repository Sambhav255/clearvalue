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

const LEGACY_COLOR = '#6B7280'
const EVERPURE_COLOR = '#F97316'

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
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
          />
          <YAxis
            tickFormatter={(v) => formatCurrency(v)}
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={{ stroke: '#475569' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1E293B',
              border: '1px solid #475569',
              borderRadius: '8px',
            }}
            labelStyle={{ color: '#F1F5F9' }}
            formatter={(value: number, name: string) => [
              formatCurrencyFull(value),
              name === 'legacy' ? 'Legacy (3yr)' : 'Everpure (3yr)',
            ]}
            labelFormatter={(label) => `${label}`}
          />
          <Legend
            wrapperStyle={{ paddingTop: '8px' }}
            formatter={(value) => (
              <span className="text-slate-400 text-sm">
                {value === 'legacy' ? 'Legacy (3yr)' : 'Everpure (3yr)'}
              </span>
            )}
          />
          <Bar
            dataKey="legacy"
            name="legacy"
            fill={LEGACY_COLOR}
            radius={[0, 4, 4, 0]}
          />
          <Bar
            dataKey="everpure"
            name="everpure"
            fill={EVERPURE_COLOR}
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
