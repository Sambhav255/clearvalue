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
    <div
      className={`rounded-2xl border border-brand-cardBorder bg-brand-card p-6 shadow-sm ${className}`}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
        {label}
      </p>
      <p
        className={`mt-1 font-bold ${
          accent ? 'text-3xl text-brand-orange' : 'text-2xl text-brand-text'
        }`}
      >
        {value}
      </p>
      {subtitle != null && (
        <p className="mt-0.5 text-xs text-brand-textMuted">{subtitle}</p>
      )}
    </div>
  )
}
