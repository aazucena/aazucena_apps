'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const progressVariants = cva('relative w-full overflow-hidden rounded-full', {
  variants: {
    variant: {
      default: 'bg-primary/20',
      cyber: 'bg-primary/10 dark:bg-signal/10 border border-border/10 dark:border-signal/20',
      glass: 'bg-background/10 dark:bg-state border border-border/10',
      branded: 'bg-muted',
    },
    size: {
      xs: 'h-1',
      sm: 'h-1.5',
      default: 'h-2',
      lg: 'h-3',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 transition-transform duration-(--motion-base) ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        cyber: 'bg-primary dark:bg-signal',
        glass: 'bg-signal',
        gradient: 'bg-signal',
        emerald: 'bg-success',
        rose: 'bg-alert',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ProgressProps
  extends
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  indicatorVariant?: VariantProps<typeof progressIndicatorVariants>['variant'];
}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, variant, size, indicatorVariant, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ variant, size }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={progressIndicatorVariants({ variant: indicatorVariant || (variant as any) })}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  ),
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
