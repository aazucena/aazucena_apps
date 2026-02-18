'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

/**
 * Stat Board (Metric Collection) Components
 */

export const statBoardVariants = cva(
  'rounded-[2rem] border transition-all duration-500 overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-card border-border shadow-sm p-8',
        glass:
          'bg-background/10 backdrop-blur-md border-border/20 text-foreground shadow-2xl p-12 md:p-20',
        cyber:
          'bg-background/80 dark:bg-black/80 border border-cyan-500/30 text-foreground shadow-[0_0_30px_rgba(6,182,212,0.1)] p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const StatBoard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof statBoardVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(statBoardVariants({ variant }), className)} {...props} />
));
StatBoard.displayName = 'StatBoard';

export const StatBoardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('mb-10 flex flex-col items-center justify-between gap-6 md:flex-row', className)}
    {...props}
  />
));
StatBoardHeader.displayName = 'StatBoardHeader';

export const StatBoardGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('grid grid-cols-1 gap-8 md:grid-cols-3', className)} {...props} />
  ),
);
StatBoardGrid.displayName = 'StatBoardGrid';
