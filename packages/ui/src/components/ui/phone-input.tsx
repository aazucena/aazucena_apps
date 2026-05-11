'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const phoneInputVariants = cva('flex w-full items-center', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: 'h-8 text-xs',
      md: 'h-9 text-sm',
      lg: 'h-10 text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

const fieldStyles: Record<string, string> = {
  default:
    'border-input bg-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
  glass: 'glass-m border-white/10 placeholder:text-white/40',
  cyber:
    'border-cyan-500/30 bg-black/50 text-cyan-50 font-mono placeholder:text-cyan-500/30 focus-within:border-cyan-400 focus-within:shadow-[0_0_10px_rgba(6,182,212,0.2)]',
};

interface CountryOption {
  code: string;
  dial: string;
  flag: string;
  name: string;
}

const DEFAULT_COUNTRIES: CountryOption[] = [
  { code: 'US', dial: '+1', flag: '\u{1F1FA}\u{1F1F8}', name: 'United States' },
  { code: 'CA', dial: '+1', flag: '\u{1F1E8}\u{1F1E6}', name: 'Canada' },
  { code: 'GB', dial: '+44', flag: '\u{1F1EC}\u{1F1E7}', name: 'United Kingdom' },
  { code: 'AU', dial: '+61', flag: '\u{1F1E6}\u{1F1FA}', name: 'Australia' },
  { code: 'DE', dial: '+49', flag: '\u{1F1E9}\u{1F1EA}', name: 'Germany' },
  { code: 'FR', dial: '+33', flag: '\u{1F1EB}\u{1F1F7}', name: 'France' },
  { code: 'JP', dial: '+81', flag: '\u{1F1EF}\u{1F1F5}', name: 'Japan' },
  { code: 'IN', dial: '+91', flag: '\u{1F1EE}\u{1F1F3}', name: 'India' },
  { code: 'PH', dial: '+63', flag: '\u{1F1F5}\u{1F1ED}', name: 'Philippines' },
  { code: 'BR', dial: '+55', flag: '\u{1F1E7}\u{1F1F7}', name: 'Brazil' },
];

export interface PhoneInputProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof phoneInputVariants> {
  value?: string;
  country?: string;
  placeholder?: string;
  disabled?: boolean;
  countries?: CountryOption[];
  onChange?: (value: string) => void;
  onCountryChange?: (code: string) => void;
}

function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 15);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

const PhoneInput = React.forwardRef<HTMLDivElement, PhoneInputProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      value = '',
      country = 'US',
      placeholder = '(555) 123-4567',
      disabled,
      countries = DEFAULT_COUNTRIES,
      onChange,
      onCountryChange,
      ...props
    },
    ref,
  ) => {
    const v = variant ?? 'default';
    const current = countries.find((c) => c.code === country) ?? countries[0]!;

    return (
      <div
        ref={ref}
        className={cn(
          'flex overflow-hidden rounded-md border transition-all',
          fieldStyles[v],
          phoneInputVariants({ variant, size }),
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        {...props}
      >
        <select
          value={current.code}
          onChange={(e) => onCountryChange?.(e.target.value)}
          disabled={disabled}
          aria-label="Country code"
          className={cn(
            'cursor-pointer appearance-none border-r bg-transparent px-2 outline-none',
            v === 'cyber' ? 'border-cyan-500/20' : 'border-input',
          )}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.dial}
            </option>
          ))}
        </select>
        <input
          type="tel"
          value={formatPhone(value)}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            onChange?.(digits);
          }}
          className="min-w-0 flex-1 bg-transparent px-3 outline-none"
        />
      </div>
    );
  },
);
PhoneInput.displayName = 'PhoneInput';

export { PhoneInput, phoneInputVariants };
