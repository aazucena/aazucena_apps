'use client';

import * as React from 'react';
import { cn } from '@aazucena/utils';
import { Input, type InputProps } from './input.js';
import { Validator, type ValidatorRule } from './validator.js';

export interface PasswordStrengthRule {
  label: string;
  test: (value: string) => boolean;
}

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  strengthRules?: PasswordStrengthRule[];
  showStrengthProgress?: boolean;
  strengthVariant?: 'default' | 'glass' | 'cyber';
  strengthSize?: 'sm' | 'md' | 'lg';
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      variant,
      strengthRules,
      showStrengthProgress = true,
      strengthVariant,
      strengthSize = 'sm',
      onChange,
      ...props
    },
    ref,
  ) => {
    const [show, setShow] = React.useState(false);
    const [value, setValue] = React.useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      onChange?.(e);
    };

    const validatorRules: ValidatorRule[] | undefined = strengthRules?.map((rule) => ({
      label: rule.label,
      valid: rule.test(value),
    }));

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={ref}
            type={show ? 'text' : 'password'}
            className={cn('pr-10', className)}
            variant={variant}
            onChange={handleChange}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
        {validatorRules && validatorRules.length > 0 && (
          <Validator
            rules={validatorRules}
            showProgress={showStrengthProgress}
            variant={strengthVariant ?? variant ?? 'default'}
            size={strengthSize}
          />
        )}
      </div>
    );
  },
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
