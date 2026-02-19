'use client';

/** @shadcn standard component */
import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipContentVariants = cva(
  'z-50 origin-[--radix-tooltip-content-transform-origin] overflow-hidden rounded-md px-3 py-1.5 text-xs animate-in fade-in-0 zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-md',
        glass: 'glass-m text-foreground dark:text-white shadow-xl',
        cyber:
          'glass bg-primary-100 border-cyan-500/40 text-foreground shadow-[0_0_15px_rgba(6,182,212,0.2)] dark:bg-black/90 dark:text-cyan-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    VariantProps<typeof tooltipContentVariants>
>(({ className, sideOffset = 4, variant, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(tooltipContentVariants({ variant }), className)}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
