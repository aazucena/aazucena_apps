'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const gaugeVariants = cva('relative flex items-center justify-center', {
  variants: {
    size: {
      sm: 'size-16',
      default: 'size-24',
      lg: 'size-32',
      xl: 'size-48',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface GaugeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof gaugeVariants> {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  strokeWidth?: number;
  variant?: 'default' | 'glass' | 'cyber' | 'success' | 'warning' | 'destructive';
}

const Gauge = React.forwardRef<HTMLDivElement, GaugeProps>(
  (
    {
      className,
      value,
      min = 0,
      max = 100,
      label,
      unit,
      size,
      strokeWidth = 10,
      variant = 'default',
      ...props
    },
    ref,
  ) => {
    const clampedValue = Math.max(min, Math.min(max, value));
    const percentage = ((clampedValue - min) / (max - min)) * 100;

    const radius = 50 - strokeWidth / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const baseColor =
      variant === 'cyber'
        ? 'stroke-signal/20'
        : variant === 'glass'
          ? 'stroke-foreground/20'
          : 'stroke-muted';
    const indicatorColor =
      variant === 'cyber'
        ? 'stroke-signal'
        : variant === 'glass'
          ? 'stroke-foreground'
          : variant === 'success'
            ? 'stroke-success'
            : variant === 'warning'
              ? 'stroke-warning'
              : variant === 'destructive'
                ? 'stroke-alert'
                : 'stroke-primary';

    return (
      <div ref={ref} className={cn(gaugeVariants({ size }), className)} {...props}>
        <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            className={baseColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
          />
          <circle
            className={cn('transition-all duration-500 ease-out', indicatorColor)}
            strokeWidth={strokeWidth}
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span
            className={cn(
              'text-2xl font-bold',
              size === 'sm' && 'text-lg',
              size === 'lg' && 'text-3xl',
              size === 'xl' && 'text-4xl',
              variant === 'cyber' && 'text-signal font-mono',
              variant === 'glass' && 'text-foreground',
            )}
          >
            {clampedValue}
            {unit}
          </span>
          {label && (
            <span
              className={cn(
                'text-muted-foreground text-sm',
                size === 'sm' && 'text-xs',
                size === 'lg' && 'text-base',
                size === 'xl' && 'text-lg',
                variant === 'cyber' && 'text-signal/80 font-mono',
                variant === 'glass' && 'text-foreground/70',
              )}
            >
              {label}
            </span>
          )}
        </div>
      </div>
    );
  },
);
Gauge.displayName = 'Gauge';

export { Gauge, gaugeVariants };
