import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'preset' | 'presetActive'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  onClick?: () => void
  children: ReactNode
  type?: 'button' | 'submit'
  className?: string
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-6 py-3 text-lg',
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-orange hover:bg-brand-orangeHover text-white font-semibold rounded-xl transition-colors duration-200',
  secondary:
    'border border-brand-border text-brand-textSecondary hover:border-brand-orange hover:text-brand-orange rounded-xl transition-colors duration-200',
  ghost:
    'border border-brand-border text-brand-textSecondary hover:border-brand-orange hover:text-brand-orange rounded-xl transition-colors duration-200',
  preset:
    'bg-white border border-brand-border text-brand-text rounded-xl font-medium transition-colors duration-200',
  presetActive:
    'bg-brand-orangeLight border border-brand-orange text-brand-orange font-semibold rounded-xl transition-colors duration-200',
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  type = 'button',
  className = '',
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  )
}
