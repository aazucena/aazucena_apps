'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { ArrowUp, ArrowDown, Activity } from '@aazucena/icons';

const trendVariants = cva(
  'inline-flex items-center gap-1 font-mono text-[10px] font-black uppercase tracking-tighter transition-all duration-300',
  {
    variants: {
      direction: {
        up: 'text-emerald-500',
        down: 'text-rose-500',
        neutral: 'text-zinc-400',
      },
      variant: {
        default: '',
        pill: 'px-2 py-0.5 rounded-md bg-current/10 border border-current/20',
        ghost: 'bg-transparent border-none',
      },
    },
    defaultVariants: {
      direction: 'neutral',
      variant: 'default',
    },
  },
);

export interface TrendProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof trendVariants> {
  value?: string | number;
  showIcon?: boolean;
}

const Trend = React.forwardRef<HTMLSpanElement, TrendProps>(
  ({ className, direction, variant, value, showIcon = true, ...props }, ref) => {
    const Icon = direction === 'up' ? ArrowUp : direction === 'down' ? ArrowDown : Activity;

    return (
      <span ref={ref} className={cn(trendVariants({ direction, variant }), className)} {...props}>
        {showIcon && (
          <Icon size={10} strokeWidth={3} className={cn(direction === 'neutral' && 'opacity-40')} />
        )}
        {value}
      </span>
    );
  },
);
Trend.displayName = 'Trend';

export { Trend, trendVariants };
