'use client';

import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const segmentedControlVariants = cva(
  'inline-flex items-center p-1 rounded-card transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-panel dark:bg-panel/50 border border-rule',
        glass: 'glass text-foreground',
        cyber:
          'bg-background/80 dark:bg-scrim border border-border dark:border-signal/20 text-foreground',
      },
      size: {
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
  'relative px-4 py-1.5 rounded-control text-[9px] font-black uppercase tracking-widest transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary',
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
          'bg-panel dark:bg-panel-raised text-primary border border-rule dark:border-rule-strong',
      },
      {
        isActive: true,
        variant: 'cyber',
        className:
          'bg-primary/20 dark:bg-signal/20 text-primary dark:text-signal border border-border dark:border-signal/40',
      },
      {
        isActive: true,
        variant: 'glass',
        className:
          'bg-background/20 dark:bg-panel-raised text-foreground border border-border dark:border-rule',
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
