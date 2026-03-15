import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className = '' }: CardProps): JSX.Element {
  return (
    <div className={`bg-navy-700 rounded-xl p-6 shadow-lg ${className}`}>
      {children}
    </div>
  )
}
