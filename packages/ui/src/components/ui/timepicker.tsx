'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const timepickerVariants = cva('inline-flex items-center', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: 'gap-1 text-xs',
      md: 'gap-1.5 text-sm',
      lg: 'gap-2 text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const selectStyles: Record<string, string> = {
  default:
    'border-input bg-background hover:bg-accent focus:ring-2 focus:ring-ring focus:ring-offset-2',
  glass: 'glass-m border-white/10',
  cyber:
    'border-cyan-500/30 bg-black/50 text-cyan-50 font-mono focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
};

const sizeMap: Record<string, string> = {
  sm: 'h-8 px-2',
  md: 'h-9 px-3',
  lg: 'h-10 px-4',
};

export interface TimepickerProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof timepickerVariants> {
  value?: { hour: number; minute: number; period: 'AM' | 'PM' };
  onChange?: (time: { hour: number; minute: number; period: 'AM' | 'PM' }) => void;
  disabled?: boolean;
  use24Hour?: boolean;
  minuteStep?: number;
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const PERIODS: Array<'AM' | 'PM'> = ['AM', 'PM'];

const Timepicker = React.forwardRef<HTMLDivElement, TimepickerProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      value,
      onChange,
      disabled,
      use24Hour,
      minuteStep = 1,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const s = size ?? 'md';
    const hours = use24Hour ? HOURS_24 : HOURS_12;
    const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

    const selCn = cn(
      'appearance-none rounded-md border outline-none transition-all cursor-pointer',
      selectStyles[v],
      sizeMap[s],
      disabled && 'pointer-events-none opacity-50',
    );

    const update = (patch: Partial<NonNullable<TimepickerProps['value']>>) => {
      if (!onChange) return;
      const current = value ?? { hour: 12, minute: 0, period: 'AM' as const };
      onChange({ ...current, ...patch });
    };

    return (
      <div ref={ref} className={cn(timepickerVariants({ variant, size }), className)} {...props}>
        <select
          value={value?.hour ?? (use24Hour ? 0 : 12)}
          onChange={(e) => update({ hour: Number(e.target.value) })}
          disabled={disabled}
          aria-label="Hour"
          className={selCn}
        >
          {hours.map((h) => (
            <option key={h} value={h}>
              {String(h).padStart(2, '0')}
            </option>
          ))}
        </select>

        <span className="text-muted-foreground font-semibold">:</span>

        <select
          value={value?.minute ?? 0}
          onChange={(e) => update({ minute: Number(e.target.value) })}
          disabled={disabled}
          aria-label="Minute"
          className={selCn}
        >
          {minutes.map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, '0')}
            </option>
          ))}
        </select>

        {!use24Hour && (
          <select
            value={value?.period ?? 'AM'}
            onChange={(e) => update({ period: e.target.value as 'AM' | 'PM' })}
            disabled={disabled}
            aria-label="Period"
            className={selCn}
          >
            {PERIODS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  },
);
Timepicker.displayName = 'Timepicker';

export { Timepicker, timepickerVariants };
