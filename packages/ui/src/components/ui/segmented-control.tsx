'use client';

import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const segmentedControlVariants = cva(
  'inline-flex items-center p-1 rounded-xl transition-all duration-300',
  {
    variants: {
          variant: {
            default: 'bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800',
            glass: 'glass text-foreground',
            cyber:
              'bg-background/80 dark:bg-black/80 border border-border dark:border-cyan-500/20 text-foreground',
          },      size: {
        default: 'gap-1',
        sm: 'gap-0.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const SegmentedControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof segmentedControlVariants>
>(({ className, variant, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(segmentedControlVariants({ variant, size }), className)}
    role="tablist"
    {...props}
  />
));
SegmentedControl.displayName = 'SegmentedControl';

const segmentedItemVariants = cva(
  'relative px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  {
    variants: {
      isActive: {
        true: '',
        false: 'text-muted-foreground hover:text-foreground',
      },
      variant: {
        default: '',
        glass: '',
        cyber: '',
      },
    },
    compoundVariants: [
      {
        isActive: true,
        variant: 'default',
        className:
          'bg-white dark:bg-zinc-700 text-primary shadow-sm border border-zinc-200 dark:border-zinc-600',
      },
      {
        isActive: true,
        variant: 'cyber',
        className:
          'bg-primary/20 dark:bg-cyan-500/20 text-primary dark:text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)] border border-border dark:border-cyan-500/40',
      },
      {
        isActive: true,
        variant: 'glass',
        className: 'bg-background/20 dark:bg-white/20 text-foreground shadow-lg border border-border dark:border-white/30',
      },
    ],
    defaultVariants: {
      isActive: false,
      variant: 'default',
    },
  },
);

interface SegmentedItemProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof segmentedItemVariants> {
  value: string;
}

const SegmentedItem = React.forwardRef<HTMLButtonElement, SegmentedItemProps>(
  ({ className, variant, isActive, ...props }, ref) => {
    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive ?? undefined}
        className={cn(segmentedItemVariants({ variant, isActive }), className)}
        {...props}
      />
    );
  },
);
SegmentedItem.displayName = 'SegmentedItem';

export { SegmentedControl, segmentedControlVariants, SegmentedItem, segmentedItemVariants };
