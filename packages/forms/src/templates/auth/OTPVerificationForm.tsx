'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { otpVerificationSchema, type OTPVerificationFormData } from '../../schemas/index.js';
import { ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface OTPVerificationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: OTPVerificationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<OTPVerificationFormData>;
  /** Display-only label for where the OTP was sent (e.g. "SMS", "email") */
  method?: string;
}

const TRUST_DURATION_OPTIONS = [
  { value: 'session', label: 'This session only' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
] as const;

export function OTPVerificationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  method = 'your authenticator app',
}: OTPVerificationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      code: '',
      rememberDevice: false,
      trustDuration: 'session' as const,
      ...defaultValues,
    } as OTPVerificationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = otpVerificationSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  return (
    <Form
      form={form}
      variant={variant}
      className={cn('max-w-xs space-y-5', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code from <span className="font-medium text-foreground">{method}</span>.
      </p>

      {/* OTP digit input — styled single field */}
      <form.Field name="code" validators={{ onChange: otpVerificationSchema.shape.code }}>
        {(field) => (
          <div className="space-y-1">
            <label className="text-sm font-medium">Verification Code</label>
            <input
              value={(field.state.value as string) || ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
                field.handleChange(raw);
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={6}
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {field.state.meta.errors?.length > 0 && (
              <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
            )}
          </div>
        )}
      </form.Field>

      <ControlledCheckbox name="rememberDevice" label="Remember this device" />

      <form.Subscribe selector={(state: any) => state.values.rememberDevice}>
        {(rememberDevice) =>
          rememberDevice ? (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Trust duration</p>
              <form.Field name="trustDuration">
                {(field) => (
                  <div className="flex gap-2">
                    {TRUST_DURATION_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.handleChange(value)}
                        className={cn(
                          'flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-all',
                          field.state.value === value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>
          ) : null
        }
      </form.Subscribe>

      <FormButton className="w-full">Verify</FormButton>
    </Form>
  );
}
