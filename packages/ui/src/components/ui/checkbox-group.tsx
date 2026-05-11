'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';
import { Checkbox } from './checkbox'; // Assuming Checkbox component exists
import { Label } from './label';

const checkboxGroupVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    direction: {
      row: 'flex flex-row flex-wrap gap-x-6 gap-y-2',
      column: 'flex flex-col gap-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    direction: 'column',
  },
});

export interface CheckboxGroupOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof checkboxGroupVariants> {
  label?: React.ReactNode; // Optional group label/legend
  options: CheckboxGroupOption[];
  value?: string[]; // Array of selected values
  onChange?: (selectedValues: string[]) => void;
  disabled?: boolean;
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      className,
      variant,
      direction,
      label,
      options,
      value: controlledValue,
      onChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(controlledValue || []);

    React.useEffect(() => {
      if (controlledValue !== undefined) {
        setSelectedValues(controlledValue);
      }
    }, [controlledValue]);

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      const newSelectedValues = checked
        ? [...selectedValues, optionValue]
        : selectedValues.filter((val) => val !== optionValue);

      setSelectedValues(newSelectedValues);
      onChange?.(newSelectedValues);
    };

    const labelId = React.useId();

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {label && (
          <div
            id={labelId}
            className={cn(
              'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              variant === 'glass' && 'text-white/80',
              variant === 'cyber' && 'font-mono text-cyan-500/80',
            )}
          >
            {label}
          </div>
        )}
        <div
          role="group"
          aria-labelledby={label ? labelId : undefined}
          className={cn(checkboxGroupVariants({ direction, variant }))}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${labelId}-${option.value}`}
                checked={selectedValues.includes(option.value)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(option.value, checked as boolean)
                }
                disabled={disabled || option.disabled}
                className={cn(
                  variant === 'glass' &&
                    'border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-blue-500',
                  variant === 'cyber' &&
                    'border-cyan-500/50 data-[state=checked]:bg-cyan-500 data-[state=checked]:text-black',
                )}
              />
              <Label
                htmlFor={`${labelId}-${option.value}`}
                className={cn(
                  'text-sm font-normal',
                  (disabled || option.disabled) && 'cursor-not-allowed opacity-70',
                  variant === 'glass' && 'text-white/90',
                  variant === 'cyber' && 'font-mono text-cyan-400',
                )}
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
CheckboxGroup.displayName = 'CheckboxGroup';

export { CheckboxGroup, checkboxGroupVariants };
