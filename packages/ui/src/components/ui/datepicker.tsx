'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const datepickerVariants = cva('relative w-full', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const triggerStyles: Record<string, string> = {
  default:
    'border-input bg-background hover:bg-accent focus:ring-2 focus:ring-ring focus:ring-offset-2',
  glass: 'glass-m border-white/10',
  cyber:
    'border-cyan-500/30 bg-black/50 text-cyan-50 font-mono focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-2 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-4 text-base',
};

export interface DatepickerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof datepickerVariants> {
  value?: Date;
  placeholder?: string;
  onChange?: (date: Date) => void;
  disabled?: boolean;
  min?: string;
  max?: string;
}

const Datepicker = React.forwardRef<HTMLDivElement, DatepickerProps>(
  (
    { className, variant = 'default', size = 'md', value, placeholder = 'Pick a date', onChange, disabled, min, max, ...props },
    ref,
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const v = variant ?? 'default';
    const s = size ?? 'md';

    const formatted = value
      ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : '';

    const isoValue = value ? value.toISOString().split('T')[0] : '';

    return (
      <div ref={ref} className={cn(datepickerVariants({ variant, size }), className)} {...props}>
        <input
          ref={inputRef}
          type="date"
          value={isoValue}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.value) onChange?.(new Date(e.target.value + 'T00:00:00'));
          }}
          className="sr-only"
          tabIndex={-1}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.showPicker()}
          className={cn(
            'flex w-full items-center gap-2 rounded-md border outline-none transition-all',
            triggerStyles[v],
            sizeStyles[s],
            disabled && 'pointer-events-none opacity-50',
          )}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted-foreground">
            <rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
          </svg>
          <span className={cn(!value && 'text-muted-foreground')}>
            {formatted || placeholder}
          </span>
        </button>
      </div>
    );
  },
);
Datepicker.displayName = 'Datepicker';

export { Datepicker, datepickerVariants };
