'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const spoilerVariants = cva('relative transition-all', {
  variants: {
    variant: {
      default: '',
      glass: 'glass-m rounded-lg p-4 border border-white/10',
      cyber:
        'rounded-lg border border-cyan-500/30 bg-black/50 p-4 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
    },
  },
  defaultVariants: { variant: 'default' },
});

const gradientMap: Record<string, string> = {
  default: 'from-transparent to-background',
  glass: 'from-transparent to-background/80',
  cyber: 'from-transparent to-black/90',
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
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-6 h-12 bg-gradient-to-b',
              gradientMap[v],
            )}
          />
        )}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'mt-1 text-sm font-medium transition-colors',
            v === 'cyber'
              ? 'text-cyan-400 hover:text-cyan-300'
              : 'text-primary hover:text-primary/80',
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
