'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

/**
 * Data List Grid Components
 */

export const dataListGridVariants = cva('grid', {
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
  'p-4 flex items-center justify-between transition-colors duration-(--motion-base) rounded-card border',
  {
    variants: {
      variant: {
        default: 'bg-panel dark:bg-background/50 border-rule hover:border-rule',
        glass:
          'bg-background/5 dark:bg-state border-border/10 text-foreground hover:bg-background/10',
        cyber:
          'bg-background/40 dark:bg-panel border-signal/20 text-foreground hover:border-signal',
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
    className={cn(
      'text-muted-foreground text-[10px] font-black tracking-widest uppercase',
      className,
    )}
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
    className={cn('text-foreground font-mono text-sm font-bold', className)}
    {...props}
  />
));
DataListValue.displayName = 'DataListValue';
