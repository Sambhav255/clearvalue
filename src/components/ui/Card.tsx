import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps): JSX.Element {
  return (
    <div
      className={`rounded-2xl border border-brand-cardBorder bg-brand-card p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}
