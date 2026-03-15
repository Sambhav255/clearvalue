import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import type { ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps): JSX.Element {
  return (
    <TooltipPrimitive.TooltipProvider delayDuration={200}>
      <TooltipPrimitive.Tooltip>
        <TooltipPrimitive.TooltipTrigger asChild>
          <span
            role="button"
            tabIndex={0}
            className="inline-flex cursor-help border-0 bg-transparent p-0 text-brand-textMuted hover:text-brand-orange [&:focus]:outline-none [&:focus-visible]:ring-2 [&:focus-visible]:ring-brand-orange [&:focus-visible]:ring-offset-2 [&:focus-visible]:ring-offset-brand-bg"
          >
            {children}
          </span>
        </TooltipPrimitive.TooltipTrigger>
        <TooltipPrimitive.TooltipPortal>
          <TooltipPrimitive.TooltipContent
            sideOffset={4}
            className="max-w-xs rounded-lg bg-brand-navy px-3 py-2 text-xs text-white"
          >
            {content}
          </TooltipPrimitive.TooltipContent>
        </TooltipPrimitive.TooltipPortal>
      </TooltipPrimitive.Tooltip>
    </TooltipPrimitive.TooltipProvider>
  )
}
