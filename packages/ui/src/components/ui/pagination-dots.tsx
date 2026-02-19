'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip.js';

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
        glass: 'p-2 bg-background/5 dark:bg-white/5 backdrop-blur-md rounded-full border border-border/10',
        cyber:
          'p-2 bg-background/40 dark:bg-black/40 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]',
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
  'rounded-full transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary/30 hover:glass bg-primary-1000 h-2 w-2',
        glass: 'bg-white/30 hover:bg-background/5 dark:bg-white/50 h-2 w-2',
        cyber: 'bg-primary/30 dark:bg-cyan-500/30 hover:glass bg-primary-1000 dark:hover:bg-cyan-500/50 h-2 w-2',
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
        className: 'h-2 w-8 bg-white scale-110',
      },
      {
        variant: 'cyber',
        isActive: true,
        className: 'h-2 w-8 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] scale-110',
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
