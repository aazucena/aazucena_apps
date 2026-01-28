/**
 * Metric Card Component
 * Displays a single impact metric (e.g., "30%", "25+") with a label.
 */

import type { JSX } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  value?: string;
  label?: string;
  description?: string;
  icon?: any;
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function MetricCard({ value, label, description, icon, className, variant = 'primary' }: MetricCardProps): JSX.Element {
  const isSecondary = variant === 'secondary';

  return (
    <div className={cn(
      "bg-white dark:bg-zinc-900/50 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm dark:shadow-none transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 group flex flex-col items-center text-center",
      className
    )}>
      <div className={cn(
        "text-3xl md:text-4xl font-black font-mono tracking-tighter bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300",
        isSecondary 
          ? "bg-gradient-to-br from-secondary-600 to-secondary-400 dark:from-secondary-400 dark:to-secondary-200" 
          : "bg-gradient-to-br from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200"
      )}>
        {value}
      </div>
      <div className="text-[10px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.2em] mb-1">
        {label}
      </div>
      {description && (
        <div className={cn(
          "text-[10px] font-mono uppercase",
          isSecondary ? "text-secondary-500/70" : "text-zinc-400 dark:text-zinc-600"
        )}>
          {description}
        </div>
      )}
      {icon && (
        <div className={cn(
          "mt-4 transition-colors duration-500",
          isSecondary 
            ? "text-secondary-300 dark:text-secondary-900 group-hover:text-secondary-500/50" 
            : "text-zinc-300 dark:text-zinc-800 group-hover:text-primary-500/50"
        )}>
          {icon}
        </div>
      )}
    </div>
  );
}