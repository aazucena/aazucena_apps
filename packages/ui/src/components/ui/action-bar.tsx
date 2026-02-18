'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const actionBarVariants = cva(
  'fixed left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-2 shadow-xl transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border border-border bg-background',
        glass: 'glass',
        cyber: 'border border-cyan-500/30 bg-black/90',
      },
      position: {
        top: '',
        bottom: '',
      },
    },
    compoundVariants: [
      { position: 'top', className: 'top-4' },
      { position: 'bottom', className: 'bottom-4' },
    ],
    defaultVariants: { variant: 'default', position: 'bottom' },
  },
);

export interface ActionBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof actionBarVariants> {
  open?: boolean;
  onClose?: () => void;
}

const ActionBar = React.forwardRef<HTMLDivElement, ActionBarProps>(
  ({ className, variant = 'default', position, open = false, onClose, children, ...props }, ref) => {
    const v = variant ?? 'default';

    if (!open) return null;

    return (
      <div
        ref={ref}
        role="toolbar"
        className={cn(
          actionBarVariants({ variant, position }),
          open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
          className,
        )}
        {...props}
      >
        {children}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'ml-1 flex h-6 w-6 items-center justify-center rounded-full transition-colors',
              v === 'cyber'
                ? 'text-cyan-500/60 hover:bg-cyan-500/10 hover:text-cyan-400'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);
ActionBar.displayName = 'ActionBar';

export { ActionBar, actionBarVariants };
