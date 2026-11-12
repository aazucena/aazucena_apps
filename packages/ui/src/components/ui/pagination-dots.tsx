'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

/**
 * Pagination Dot Components (Extracted)
 */

export const paginationDotsVariants = cva(
  'flex items-center justify-center gap-2 transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'mt-6',
        inline: '',
        glass: 'p-2 bg-background/5 dark:bg-state rounded-full border border-border/10',
        cyber: 'p-2 bg-background/40 dark:bg-panel rounded-full border border-signal/20',
      },
      position: {
        default: '',
        'fixed-right': 'fixed top-1/2 right-8 z-50 -translate-y-1/2 flex-col gap-4',
        'fixed-left': 'fixed top-1/2 left-8 z-50 -translate-y-1/2 flex-col gap-4',
      },
      visible: {
        true: 'opacity-100 scale-100',
        false: 'opacity-0 scale-90 pointer-events-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      position: 'default',
      visible: true,
    },
  },
);

export const PaginationDots = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof paginationDotsVariants>
>(({ className, variant, position, visible, ...props }, ref) => (
  <TooltipProvider>
    <div
      ref={ref}
      className={cn(paginationDotsVariants({ variant, position, visible }), className)}
      {...props}
    />
  </TooltipProvider>
));
PaginationDots.displayName = 'PaginationDots';

export const paginationDotVariants = cva(
  'rounded-full transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      variant: {
        default: 'bg-primary/30 hover:glass bg-primary-1000 h-2 w-2',
        glass: 'bg-panel-raised hover:bg-background/5 h-2 w-2',
        cyber:
          'bg-primary/30 dark:bg-signal/30 hover:glass bg-primary-1000 dark:hover:bg-signal/50 h-2 w-2',
      },
      isActive: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        isActive: true,
        className: 'h-2 w-8 bg-primary scale-110',
      },
      {
        variant: 'glass',
        isActive: true,
        className: 'h-2 w-8 bg-panel scale-110',
      },
      {
        variant: 'cyber',
        isActive: true,
        className: 'h-2 w-8 bg-signal scale-110',
      },
    ],
    defaultVariants: {
      variant: 'default',
      isActive: false,
    },
  },
);

export interface PaginationDotProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof paginationDotVariants> {
  tooltip?: string;
  tooltipSide?: 'left' | 'right' | 'top' | 'bottom';
}

export const PaginationDot = React.forwardRef<HTMLButtonElement, PaginationDotProps>(
  ({ className, variant, isActive, tooltip, tooltipSide = 'left', ...props }, ref) => {
    const dot = (
      <button
        ref={ref}
        className={cn(paginationDotVariants({ variant, isActive }), className)}
        {...props}
      />
    );

    if (!tooltip) return dot;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{dot}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
      </Tooltip>
    );
  },
);
PaginationDot.displayName = 'PaginationDot';
