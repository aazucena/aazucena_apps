'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const indicatorVariants = cva('absolute flex items-center justify-center rounded-full', {
  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground',
      glass: 'glass-m text-foreground',
      cyber:
        'bg-cyan-500 text-black shadow-[0_0_8px_rgba(6,182,212,0.6)]',
      destructive: 'bg-destructive text-destructive-foreground',
      success: 'bg-emerald-500 text-white',
      warning: 'bg-amber-500 text-black',
    },
    size: {
      dot: 'size-2.5',
      sm: 'size-4 text-[9px] font-bold',
      md: 'size-5 text-[10px] font-bold',
      lg: 'size-6 text-xs font-bold',
    },
    position: {
      'top-right': '-top-1 -right-1',
      'top-left': '-top-1 -left-1',
      'bottom-right': '-bottom-1 -right-1',
      'bottom-left': '-bottom-1 -left-1',
    },
    ping: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'sm',
    position: 'top-right',
    ping: false,
  },
});

export interface IndicatorProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof indicatorVariants> {
  count?: number;
  maxCount?: number;
  showZero?: boolean;
}

const Indicator = React.forwardRef<HTMLSpanElement, IndicatorProps>(
  (
    { className, variant, size, position, ping, count, maxCount = 99, showZero, children, ...props },
    ref,
  ) => {
    const showContent = size !== 'dot' && (count !== undefined && (count > 0 || showZero));
    const displayCount = count !== undefined && count > maxCount ? `${maxCount}+` : count;

    return (
      <span ref={ref} className="relative inline-flex">
        {children}
        <span
          className={cn(indicatorVariants({ variant, size, position }), className)}
          {...props}
        >
          {ping && (
            <span className="absolute inset-0 animate-ping rounded-full bg-current opacity-75" />
          )}
          {showContent && <span className="relative">{displayCount}</span>}
        </span>
      </span>
    );
  },
);
Indicator.displayName = 'Indicator';

export { Indicator, indicatorVariants };
