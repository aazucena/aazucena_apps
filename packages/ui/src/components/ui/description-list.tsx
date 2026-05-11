'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const descriptionListVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'rounded-lg border bg-card',
      glass: 'rounded-lg bg-white/5 border-white/10 text-white',
      cyber: 'rounded-lg bg-black border-cyan-500/20 text-cyan-50',
    },
    size: {
      sm: 'p-3 text-sm',
      default: 'p-4 text-base',
      lg: 'p-5 text-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface DescriptionListItem {
  label: React.ReactNode;
  value: React.ReactNode;
}

export interface DescriptionListProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof descriptionListVariants> {
  title?: string;
  items: DescriptionListItem[];
}

const DescriptionList = React.forwardRef<HTMLDivElement, DescriptionListProps>(
  ({ className, variant, size, title, items, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(descriptionListVariants({ variant, size }), className)}
        {...props}
      >
        {title && (
          <h3
            className={cn(
              'mb-4 font-semibold',
              size === 'sm' && 'text-base',
              size === 'default' && 'text-lg',
              size === 'lg' && 'text-xl',
              variant === 'cyber' && 'font-mono text-cyan-400 italic',
              variant === 'glass' && 'text-white',
            )}
          >
            {title}
          </h3>
        )}
        <dl className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row md:items-start">
              <dt
                className={cn(
                  'text-muted-foreground font-medium md:w-1/3',
                  variant === 'glass' && 'text-white/70',
                  variant === 'cyber' && 'font-mono text-cyan-500/80',
                  size === 'sm' && 'text-xs',
                  size === 'lg' && 'text-base',
                )}
              >
                {item.label}
              </dt>
              <dd
                className={cn(
                  'mt-1 md:mt-0 md:w-2/3',
                  variant === 'glass' && 'text-white',
                  variant === 'cyber' && 'font-mono text-cyan-400',
                  size === 'sm' && 'text-sm',
                  size === 'lg' && 'text-xl',
                )}
              >
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  },
);
DescriptionList.displayName = 'DescriptionList';

export { DescriptionList, descriptionListVariants };
