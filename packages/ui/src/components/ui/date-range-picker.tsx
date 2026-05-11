'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import type { DateRange } from 'react-day-picker';
import { RangeCalendar } from './range-calendar';

const dateRangePickerVariants = cva('relative w-full', {
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

const dropdownStyles: Record<string, string> = {
  default: 'border-border bg-popover shadow-lg',
  glass: 'glass border-white/10 shadow-xl',
  cyber: 'border-cyan-500/30 bg-black/95 shadow-[0_0_20px_rgba(6,182,212,0.1)]',
};

export interface DateRangePickerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof dateRangePickerVariants> {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  numberOfMonths?: number;
  align?: 'start' | 'center' | 'end';
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      value,
      onChange,
      placeholder = 'Pick a date range',
      disabled,
      numberOfMonths = 2,
      align = 'start',
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const v = variant ?? 'default';
    const s = size ?? 'md';

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      if (open) document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const displayText =
      value?.from && value?.to
        ? `${formatDate(value.from)} – ${formatDate(value.to)}`
        : value?.from
          ? formatDate(value.from)
          : '';

    return (
      <div
        ref={(node) => {
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={cn(dateRangePickerVariants({ variant, size }), className)}
        {...props}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            'flex w-full items-center gap-2 rounded-md border transition-all outline-none',
            triggerStyles[v],
            sizeStyles[s],
            disabled && 'pointer-events-none opacity-50',
          )}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground shrink-0"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M16 2v4" />
            <path d="M8 2v4" />
            <path d="M3 10h18" />
          </svg>
          <span className={cn(!displayText && 'text-muted-foreground')}>
            {displayText || placeholder}
          </span>
        </button>

        {open && (
          <div
            className={cn(
              'absolute z-50 mt-1 rounded-md border p-0',
              dropdownStyles[v],
              align === 'end' && 'right-0',
              align === 'center' && 'left-1/2 -translate-x-1/2',
            )}
          >
            <RangeCalendar
              variant={v === 'default' ? 'default' : v === 'glass' ? 'glass' : 'cyber'}
              value={value}
              onChange={(range) => {
                onChange?.(range);
                if (range?.from && range?.to) setOpen(false);
              }}
              numberOfMonths={numberOfMonths}
            />
          </div>
        )}
      </div>
    );
  },
);
DateRangePicker.displayName = 'DateRangePicker';

export { DateRangePicker, dateRangePickerVariants };
