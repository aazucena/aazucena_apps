'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-badge text-sm font-medium transition',
  {
    variants: {
      variant: {
        default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        glass: 'glass text-foreground hover:opacity-80',
        cyber: 'bg-signal/10 border border-signal/30 text-signal font-mono text-xs',
        outline: 'border border-input bg-background hover:bg-state',
        primary: 'bg-primary/10 text-primary border border-primary/20',
        destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
      },
      size: {
        sm: 'h-6 px-2 text-xs',
        md: 'h-7 px-2.5 text-sm',
        lg: 'h-8 px-3 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface ChipProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chipVariants> {
  icon?: React.ReactNode;
  onDismiss?: () => void;
  disabled?: boolean;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, size, icon, onDismiss, disabled, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        chipVariants({ variant, size }),
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      {...props}
    >
      {icon && <span className="[&_svg]:size-3.5">{icon}</span>}
      <span className="truncate">{children}</span>
      {onDismiss && (
        <button
          type="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="ml-0.5 rounded-full p-0.5 opacity-60 transition-opacity hover:opacity-100"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  ),
);
Chip.displayName = 'Chip';

export { Chip, chipVariants };
