import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps): JSX.Element {
  return (
    <div
      className={cn(
        'rounded-2xl border border-brand-cardBorder bg-brand-card p-6 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}
