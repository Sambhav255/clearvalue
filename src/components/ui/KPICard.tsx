interface KPICardProps {
  label: string
  value: string
  subtitle?: string
  accent?: boolean
  className?: string
}

export function KPICard({
  label,
  value,
  subtitle,
  accent = false,
  className = '',
}: KPICardProps): JSX.Element {
  return (
    <div className={`rounded-xl bg-navy-700 p-6 shadow-lg ${className}`}>
      <p className="text-sm text-slate-400">{label}</p>
      <p
        className={`mt-1 text-2xl font-semibold ${
          accent ? 'text-orange-500' : 'text-slate-100'
        }`}
      >
        {value}
      </p>
      {subtitle != null && (
        <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>
      )}
    </div>
  )
}
