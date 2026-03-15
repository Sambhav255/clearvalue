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
            className="inline-flex cursor-help border-0 bg-transparent p-0 [&:focus]:outline-none [&:focus-visible]:ring-2 [&:focus-visible]:ring-orange-500 [&:focus-visible]:ring-offset-2 [&:focus-visible]:ring-offset-navy-900"
          >
            {children}
          </span>
        </TooltipPrimitive.TooltipTrigger>
        <TooltipPrimitive.TooltipPortal>
          <TooltipPrimitive.TooltipContent
            sideOffset={4}
            className="max-w-xs rounded bg-navy-800 px-2 py-1 text-xs text-slate-100 shadow-lg"
          >
            {content}
          </TooltipPrimitive.TooltipContent>
        </TooltipPrimitive.TooltipPortal>
      </TooltipPrimitive.Tooltip>
    </TooltipPrimitive.TooltipProvider>
  )
}
