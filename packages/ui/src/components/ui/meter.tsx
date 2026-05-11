'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const meterVariants = cva(
  'relative h-2 w-full rounded-full overflow-hidden transition-colors duration-300',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        glass: 'bg-white/10',
        cyber: 'bg-cyan-500/10',
        success: 'bg-emerald-500/20',
        warning: 'bg-amber-500/20',
        destructive: 'bg-rose-500/20',
      },
      size: {
        sm: 'h-1.5',
        default: 'h-2',
        lg: 'h-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const meterIndicatorVariants = cva('h-full transition-all duration-300 ease-out', {
  variants: {
    variant: {
      default: 'bg-primary',
      glass: 'bg-white',
      cyber: 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]',
      success: 'bg-emerald-500',
      warning: 'bg-amber-500',
      destructive: 'bg-rose-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface MeterProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof meterVariants> {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  showValue?: boolean;
}

const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
  (
    {
      className,
      variant,
      size,
      value,
      min = 0,
      max = 100,
      label,
      unit,
      showValue = false,
      ...props
    },
    ref,
  ) => {
    const clampedValue = Math.max(min, Math.min(max, value));
    const percentage = ((clampedValue - min) / (max - min)) * 100;

    const currentVariant = React.useMemo(() => {
      if (variant) return variant;
      if (percentage > 85) return 'destructive';
      if (percentage > 60) return 'warning';
      return 'success';
    }, [percentage, variant]);

    return (
      <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props}>
        {(label || showValue) && (
          <div className="flex items-center justify-between text-sm font-medium">
            {label && (
              <span
                className={cn(
                  'text-muted-foreground',
                  variant === 'cyber' && 'font-mono text-cyan-500/80',
                  variant === 'glass' && 'text-white/70',
                )}
              >
                {label}
              </span>
            )}
            {showValue && (
              <span
                className={cn(
                  'text-foreground',
                  variant === 'cyber' && 'font-mono text-cyan-400',
                  variant === 'glass' && 'text-white',
                )}
              >
                {clampedValue}
                {unit}
              </span>
            )}
          </div>
        )}
        <div className={cn(meterVariants({ variant: currentVariant, size }))}>
          <div
            className={cn(meterIndicatorVariants({ variant: currentVariant }))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  },
);
Meter.displayName = 'Meter';

export { Meter, meterVariants };
