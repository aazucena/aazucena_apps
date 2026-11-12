'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Input } from './input';
import { Button } from './button';
import { Label } from './label';
import { Plus, Minus } from '@aazucena/icons';
import { useNumberField } from '../../hooks/use-number-field';

const numberFieldVariants = cva('flex flex-col gap-2', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface NumberFieldProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'value' | 'onChange'>,
    VariantProps<typeof numberFieldVariants> {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  scrubArea?: boolean;
}

const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      className,
      variant,
      size = 'default',
      value: controlledValue,
      onChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      label,
      unit,
      scrubArea = false,
      disabled,
      ...props
    },
    ref,
  ) => {
    const id = React.useId();
    const {
      internalValue,
      scrubRef,
      handleInputChange,
      handleIncrement,
      handleDecrement,
      handleWheel,
      handleMouseDown,
    } = useNumberField({ controlledValue, onChange, min, max, step, scrubArea, disabled });

    return (
      <div ref={ref} className={cn(numberFieldVariants({ variant, size }), className)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="group flex items-center">
          <Button
            type="button"
            variant="outline"
            size={size}
            className={cn(
              'rounded-r-none',
              variant === 'glass' && 'border-rule text-foreground',
              variant === 'cyber' && 'border-signal/30 text-signal',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            onClick={handleDecrement}
            disabled={disabled || (min !== undefined && internalValue <= min)}
          >
            <Minus className="size-4" />
          </Button>
          <div
            className={cn('relative flex-1', scrubArea && !disabled && 'cursor-ew-resize')}
            ref={scrubRef}
            onMouseDown={handleMouseDown}
          >
            <Input
              id={id}
              type="number"
              value={internalValue}
              onChange={handleInputChange}
              onWheel={handleWheel}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              className={cn(
                'rounded-none text-center [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none',
                variant === 'glass' &&
                  'border-rule bg-state text-foreground placeholder:text-foreground/40',
                variant === 'cyber' &&
                  'border-signal/20 bg-signal/5 text-signal placeholder:text-muted-foreground font-mono text-xs',
                size === 'sm' && 'h-8 text-xs',
                size === 'lg' && 'h-12 text-base',
                size === 'default' && 'h-10 text-sm',
                disabled && 'cursor-not-allowed opacity-50',
              )}
              {...props}
            />
            {unit && (
              <span
                className={cn(
                  'text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2',
                  size === 'sm' && 'text-[10px]',
                  size === 'lg' && 'text-sm',
                  size === 'default' && 'text-xs',
                  variant === 'glass' && 'text-foreground/60',
                  variant === 'cyber' && 'text-muted-foreground font-mono',
                )}
              >
                {unit}
              </span>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size={size}
            className={cn(
              'rounded-l-none',
              variant === 'glass' && 'border-rule text-foreground',
              variant === 'cyber' && 'border-signal/30 text-signal',
              disabled && 'cursor-not-allowed opacity-50',
            )}
            onClick={handleIncrement}
            disabled={disabled || (max !== undefined && internalValue >= max)}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </div>
    );
  },
);
NumberField.displayName = 'NumberField';

export { NumberField, numberFieldVariants };
