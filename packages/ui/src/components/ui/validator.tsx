'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@aazucena/utils';

const validatorVariants = cva('w-full space-y-2', {
  variants: {
    variant: {
      default: '',
      glass: '',
      cyber: '',
    },
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
});

export interface ValidatorRule {
  label: string;
  valid: boolean;
}

export interface ValidatorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    VariantProps<typeof validatorVariants> {
  rules: ValidatorRule[];
  showProgress?: boolean;
}

const Validator = React.forwardRef<HTMLDivElement, ValidatorProps>(
  ({ className, variant = 'default', size, rules, showProgress = false, ...props }, ref) => {
    const v = variant ?? 'default';
    const validCount = rules.filter((r) => r.valid).length;
    const pct = rules.length > 0 ? (validCount / rules.length) * 100 : 0;

    return (
      <div ref={ref} className={cn(validatorVariants({ variant, size }), className)} {...props}>
        {showProgress && (
          <div
            className={cn(
              'h-1.5 w-full overflow-hidden rounded-full',
              v === 'cyber' ? 'bg-cyan-500/10' : 'bg-muted',
            )}
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300',
                pct === 100
                  ? v === 'cyber'
                    ? 'bg-green-400'
                    : 'bg-green-500'
                  : pct >= 50
                    ? v === 'cyber'
                      ? 'bg-yellow-400'
                      : 'bg-yellow-500'
                    : v === 'cyber'
                      ? 'bg-red-400'
                      : 'bg-red-500',
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
        <ul className="space-y-1">
          {rules.map((rule, i) => (
            <li key={i} className="flex items-center gap-2">
              {rule.valid ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={cn(v === 'cyber' ? 'text-green-400' : 'text-green-500')}
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className={cn(v === 'cyber' ? 'text-red-400' : 'text-red-500')}
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              )}
              <span
                className={cn(
                  rule.valid
                    ? v === 'cyber'
                      ? 'text-cyan-50/60'
                      : 'text-muted-foreground'
                    : v === 'cyber'
                      ? 'text-cyan-50'
                      : 'text-foreground',
                  v === 'cyber' && 'font-mono',
                )}
              >
                {rule.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
Validator.displayName = 'Validator';

export { Validator, validatorVariants };
