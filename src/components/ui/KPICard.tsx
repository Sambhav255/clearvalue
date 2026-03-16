import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface KPICardProps {
  label: string
  value: string
  subtitle?: string
  accent?: boolean
  className?: string
  /** Optional tooltip/popover trigger for audit-ready transparency */
  tooltipContent?: ReactNode
}

export function KPICard({
  label,
  value,
  subtitle,
  accent = false,
  className = '',
  tooltipContent,
}: KPICardProps): JSX.Element {
  const valueEl = (
    <p
      className={cn(
        'mt-1 font-bold',
        accent ? 'text-3xl text-brand-orange' : 'text-2xl text-brand-text'
      )}
    >
      {value}
    </p>
  )

  return (
    <div
      className={cn(
        'rounded-2xl border border-brand-cardBorder bg-brand-card p-6 shadow-sm',
        className
      )}
    >
      <p className="text-sm font-medium uppercase tracking-wide text-brand-textSecondary">
        {label}
      </p>
      {tooltipContent ? (
        <span className="inline-flex items-baseline gap-1.5">
          {valueEl}
          {tooltipContent}
        </span>
      ) : (
        valueEl
      )}
      {subtitle != null && (
        <p className="mt-0.5 text-xs text-brand-textMuted">{subtitle}</p>
      )}
    </div>
  )
}
