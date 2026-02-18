'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const inplaceVariants = cva('relative inline-block transition-all', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: 'font-mono',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

export interface InplaceProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onToggle'>,
    VariantProps<typeof inplaceVariants> {
  display: React.ReactNode;
  active?: boolean;
  onToggle?: (active: boolean) => void;
  closable?: boolean;
  disabled?: boolean;
}

const Inplace = React.forwardRef<HTMLDivElement, InplaceProps>(
  (
    {
      className,
      variant = 'default',
      size,
      display,
      children,
      active: controlledActive,
      onToggle,
      closable = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internalActive, setInternalActive] = React.useState(false);
    const active = controlledActive ?? internalActive;
    const v = variant ?? 'default';

    const toggle = (value: boolean) => {
      if (disabled) return;
      setInternalActive(value);
      onToggle?.(value);
    };

    return (
      <div
        ref={ref}
        className={cn(
          inplaceVariants({ variant, size }),
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...props}
      >
        {active ? (
          <div className="flex items-center gap-2">
            <div className="flex-1">{children}</div>
            {closable && (
              <button
                type="button"
                aria-label="Close"
                onClick={() => toggle(false)}
                className={cn(
                  'shrink-0 rounded p-0.5 transition-colors',
                  v === 'cyber'
                    ? 'text-cyan-400 hover:text-cyan-300'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => toggle(true)}
            className={cn(
              'cursor-pointer rounded px-1 py-0.5 transition-colors',
              v === 'cyber'
                ? 'text-cyan-400 hover:bg-cyan-500/10'
                : v === 'glass'
                  ? 'hover:bg-white/10'
                  : 'hover:bg-accent',
            )}
          >
            {display}
          </button>
        )}
      </div>
    );
  },
);
Inplace.displayName = 'Inplace';

export { Inplace, inplaceVariants };
