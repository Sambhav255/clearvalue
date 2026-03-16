import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '../../lib/utils'

export function Popover({
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return (
    <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>
  )
}

export function PopoverTrigger({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverPrimitive.Trigger
      className={cn('inline-flex cursor-pointer outline-none', className)}
      {...props}
    />
  )
}

export function PopoverContent({
  className,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 max-w-sm rounded-xl border border-brand-cardBorder bg-brand-card p-4 text-sm text-brand-text shadow-lg outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

export { PopoverClose } from '@radix-ui/react-popover'
