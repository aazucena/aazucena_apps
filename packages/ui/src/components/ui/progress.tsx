'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const progressVariants = cva('relative w-full overflow-hidden rounded-full transition-all', {
  variants: {
    variant: {
      default: 'bg-primary/20',
      cyber: 'bg-primary/10 dark:bg-cyan-500/10 border border-border/10 dark:border-cyan-500/20',
      glass: 'bg-background/10 dark:bg-white/10 backdrop-blur-sm border border-border/10',
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
  'h-full w-full flex-1 transition-all duration-500 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        cyber: 'bg-primary dark:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]',
        glass: 'bg-primary dark:bg-white',
        gradient: 'bg-gradient-to-r from-primary to-secondary',
        emerald: 'bg-emerald-500',
        rose: 'bg-rose-500',
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
