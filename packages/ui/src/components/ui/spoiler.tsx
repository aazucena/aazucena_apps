'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const spoilerVariants = cva('relative transition-all', {
  variants: {
    variant: {
      default: '',
      glass: 'glass rounded-control p-4 border border-rule',
      cyber: 'rounded-control border border-signal/30 bg-scrim p-4',
    },
  },
  defaultVariants: { variant: 'default' },
});

const gradientMap: Record<string, string> = {
  default: 'to-background',
  glass: 'to-background/80',
  cyber: '',
};

export interface SpoilerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spoilerVariants> {
  maxHeight?: number;
  showLabel?: string;
  hideLabel?: string;
  defaultOpen?: boolean;
}

const Spoiler = React.forwardRef<HTMLDivElement, SpoilerProps>(
  (
    {
      className,
      variant = 'default',
      maxHeight = 100,
      showLabel = 'Show more',
      hideLabel = 'Show less',
      defaultOpen = false,
      children,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(defaultOpen);
    const v = variant ?? 'default';

    return (
      <div ref={ref} className={cn(spoilerVariants({ variant }), className)} {...props}>
        <div
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: open ? 'none' : maxHeight }}
        >
          {children}
        </div>
        {!open && (
          <div
            className={cn('pointer-events-none absolute inset-x-0 bottom-6 h-12', gradientMap[v])}
          />
        )}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'mt-1 text-sm font-medium transition-colors',
            v === 'cyber' ? 'text-signal hover:text-signal' : 'text-primary hover:text-primary/80',
          )}
        >
          {open ? hideLabel : showLabel}
        </button>
      </div>
    );
  },
);
Spoiler.displayName = 'Spoiler';

export { Spoiler, spoilerVariants };
