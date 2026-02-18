'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const numberInputVariants = cva(
  'inline-flex items-center rounded-md border transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
        glass: 'glass-m border-white/10 focus-within:border-white/30',
        cyber:
          'border-cyan-500/30 bg-black/50 focus-within:border-cyan-400 focus-within:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
      },
      size: {
        sm: 'h-8 text-xs',
        md: 'h-9 text-sm',
        lg: 'h-10 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface NumberInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange' | 'type'>,
    VariantProps<typeof numberInputVariants> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    { className, variant, size, value: controlledValue, defaultValue = 0, min, max, step = 1, onChange, disabled, ...props },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = controlledValue ?? internalValue;

    const clamp = (v: number) => {
      let n = v;
      if (min !== undefined) n = Math.max(min, n);
      if (max !== undefined) n = Math.min(max, n);
      return n;
    };

    const update = (next: number) => {
      const clamped = clamp(next);
      setInternalValue(clamped);
      onChange?.(clamped);
    };

    const btnCn = cn(
      'flex h-full items-center justify-center px-2 transition-colors disabled:opacity-40',
      variant === 'cyber'
        ? 'text-cyan-400 hover:bg-cyan-500/10'
        : 'text-muted-foreground hover:bg-accent',
    );

    return (
      <div className={cn(numberInputVariants({ variant, size }), disabled && 'opacity-50', className)}>
        <button
          type="button"
          aria-label="Decrease"
          disabled={disabled || (min !== undefined && value <= min)}
          onClick={() => update(value - step)}
          className={cn(btnCn, 'rounded-l-md border-r border-inherit')}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14" />
          </svg>
        </button>
        <input
          ref={ref}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => update(Number(e.target.value))}
          className="w-14 bg-transparent text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...props}
        />
        <button
          type="button"
          aria-label="Increase"
          disabled={disabled || (max !== undefined && value >= max)}
          onClick={() => update(value + step)}
          className={cn(btnCn, 'rounded-r-md border-l border-inherit')}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14" /><path d="M12 5v14" />
          </svg>
        </button>
      </div>
    );
  },
);
NumberInput.displayName = 'NumberInput';

export { NumberInput, numberInputVariants };
