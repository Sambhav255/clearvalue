import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps): JSX.Element {
  return (
    <TooltipPrimitive.TooltipProvider delayDuration={200}>
      <TooltipPrimitive.Tooltip>
        <TooltipPrimitive.TooltipTrigger asChild>
          <span
            role="button"
            tabIndex={0}
            className={cn(
              'inline-flex cursor-help border-0 bg-transparent p-0 text-brand-textMuted hover:text-brand-orange',
              '[&:focus]:outline-none [&:focus-visible]:ring-2 [&:focus-visible]:ring-brand-orange [&:focus-visible]:ring-offset-2 [&:focus-visible]:ring-offset-brand-bg'
            )}
          >
            {children}
          </span>
        </TooltipPrimitive.TooltipTrigger>
        <TooltipPrimitive.TooltipPortal>
          <TooltipPrimitive.TooltipContent
            side={side}
            sideOffset={4}
            className={cn(
              'max-w-xs rounded-lg bg-brand-navy px-3 py-2 text-xs text-white'
            )}
          >
            {content}
          </TooltipPrimitive.TooltipContent>
        </TooltipPrimitive.TooltipPortal>
      </TooltipPrimitive.Tooltip>
    </TooltipPrimitive.TooltipProvider>
  )
}
