'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

/**
 * Data List Grid Components
 */

export const dataListGridVariants = cva('grid transition-all duration-300', {
  variants: {
    cols: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
      5: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5',
    },
    gap: {
      default: 'gap-4',
      lg: 'gap-6',
    },
  },
  defaultVariants: {
    cols: 4,
    gap: 'default',
  },
});

export const DataListGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof dataListGridVariants>
>(({ className, cols, gap, ...props }, ref) => (
  <div ref={ref} className={cn(dataListGridVariants({ cols, gap }), className)} {...props} />
));
DataListGrid.displayName = 'DataListGrid';

export const dataListItemVariants = cva(
  'p-4 flex items-center justify-between transition-all duration-300 rounded-2xl border',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700',
        glass: 'bg-background/5 dark:bg-white/5 border-border/10 text-foreground hover:bg-background/10 dark:bg-white/10',
        cyber: 'bg-background/40 dark:bg-black/40 border-cyan-500/20 text-foreground hover:border-cyan-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const DataListItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof dataListItemVariants>
>(({ className, variant, ...props }, ref) => (
  <div ref={ref} className={cn(dataListItemVariants({ variant }), className)} {...props} />
));
DataListItem.displayName = 'DataListItem';

export const DataListLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('text-[10px] font-black tracking-widest text-zinc-400 uppercase', className)}
    {...props}
  />
));
DataListLabel.displayName = 'DataListLabel';

export const DataListValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn('font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100', className)}
    {...props}
  />
));
DataListValue.displayName = 'DataListValue';
