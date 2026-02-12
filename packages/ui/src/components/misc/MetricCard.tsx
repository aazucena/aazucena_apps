/**
 * Metric Card Component
 * Displays a single impact metric (e.g., "30%", "25+") with a label and optional icon.
 * Supports multiple color variants and a technical mono-style typography.
 */

import React, { type JSX, type ReactNode } from 'react';
import { cn } from '@aazucena/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const metricCardVariants = cva(
  'group flex flex-col items-center text-center p-6 rounded-3xl border transition-all duration-300 shadow-sm dark:shadow-none hover:border-zinc-300 dark:hover:border-zinc-700',
  {
    variants: {
      variant: {
        primary: 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800',
        secondary: 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800',
        success: 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800',
        rose: 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800',
        default: 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const valueVariants = cva(
  'text-3xl md:text-4xl font-black font-mono tracking-tighter bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-br from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200',
        secondary:
          'bg-gradient-to-br from-secondary-600 to-secondary-400 dark:from-secondary-400 dark:to-secondary-200',
        success:
          'bg-gradient-to-br from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-200',
        rose: 'bg-gradient-to-br from-rose-600 to-rose-400 dark:from-rose-400 dark:to-rose-200',
        default: 'text-zinc-900 dark:text-zinc-100 bg-none',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const descriptionVariants = cva('text-[10px] font-mono uppercase', {
  variants: {
    variant: {
      primary: 'text-zinc-400 dark:text-zinc-600',
      secondary: 'text-secondary-500/70',
      success: 'text-emerald-500/70',
      rose: 'text-rose-500/70',
      default: 'text-zinc-400 dark:text-zinc-600',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

const iconVariants = cva('mt-4 transition-colors duration-500', {
  variants: {
    variant: {
      primary: 'text-zinc-300 dark:text-zinc-800 group-hover:text-primary-500/50',
      secondary: 'text-secondary-300 dark:text-secondary-900 group-hover:text-secondary-500/50',
      success: 'text-emerald-300 dark:text-emerald-900 group-hover:text-emerald-500/50',
      rose: 'text-rose-300 dark:text-rose-900 group-hover:text-rose-500/50',
      default: 'text-zinc-300 dark:text-zinc-800 group-hover:text-zinc-500/50',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface MetricCardProps extends VariantProps<typeof metricCardVariants> {
  /** The main value to display (e.g., "30%") */
  value?: string;
  /** The label for the metric */
  label?: string;
  /** Optional sub-description */
  description?: string;
  /** Optional icon to display at the bottom */
  icon?: ReactNode;
  /** Optional CSS class override */
  className?: string;
}

export function MetricCard({
  value,
  label,
  description,
  icon,
  className,
  variant,
}: MetricCardProps): JSX.Element {
  return (
    <div className={cn(metricCardVariants({ variant }), className)}>
      <div className={valueVariants({ variant })}>{value}</div>
      <div className="mb-1 text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase dark:text-zinc-400">
        {label}
      </div>
      {description && <div className={descriptionVariants({ variant })}>{description}</div>}
      {icon && <div className={iconVariants({ variant })}>{icon}</div>}
    </div>
  );
}
