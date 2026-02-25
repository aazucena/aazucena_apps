'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { biometricAuthSchema, type BiometricAuthFormData } from '../../schemas/index.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface BiometricAuthFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: BiometricAuthFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<BiometricAuthFormData>;
}

const PREFERRED_METHOD_OPTIONS = [
  { value: 'faceId', label: 'Face ID', emoji: '🤳' },
  { value: 'fingerprint', label: 'Fingerprint', emoji: '👆' },
  { value: 'either', label: 'Either', emoji: '🔐' },
] as const;

const FALLBACK_OPTIONS = [
  { value: 'pin', label: 'PIN' },
  { value: 'password', label: 'Password' },
  { value: 'none', label: 'None' },
] as const;

// Inline schemas for field validators — biometricAuthSchema uses .refine() (ZodEffects)
// so .shape is not available on it. We use standalone shapes for validators.
const preferredMethodSchema = z.enum(['faceId', 'fingerprint', 'either']);
const fallbackMethodSchema = z.enum(['pin', 'password', 'none']);

export function BiometricAuthForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: BiometricAuthFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      consentGranted: false,
      preferredMethod: 'either' as const,
      fallbackMethod: 'password' as const,
      ...defaultValues,
    } as BiometricAuthFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = biometricAuthSchema.parse(value);
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
      className={cn('max-w-sm space-y-5', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      {/* Biometric icon + headline */}
      <div className="flex flex-col items-center gap-2 py-2">
        <span className="text-5xl">🔏</span>
        <p className="text-sm font-medium">Enable Biometric Authentication</p>
        <p className="text-center text-xs text-muted-foreground">
          Your biometric data never leaves your device. We only store a cryptographic proof.
        </p>
      </div>

      {/* Consent checkbox */}
      <form.Field name="consentGranted">
        {(field) => (
          <div className="space-y-1">
            <label
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-all',
                field.state.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40',
              )}
            >
              <input
                type="checkbox"
                checked={!!field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-input accent-primary"
              />
              <span className="text-sm">
                I consent to biometric data being used for authentication on this device in
                accordance with the{' '}
                <span className="text-primary underline-offset-2 hover:underline">
                  Privacy Policy
                </span>
                .
              </span>
            </label>
            {field.state.meta.errors?.length > 0 && (
              <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
            )}
          </div>
        )}
      </form.Field>

      {/* Preferred method */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Preferred Method</p>
        <form.Field name="preferredMethod" validators={{ onChange: preferredMethodSchema }}>
          {(field) => (
            <div className="grid grid-cols-3 gap-2">
              {PREFERRED_METHOD_OPTIONS.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-md border p-3 transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      field.state.value === value ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      {/* Fallback method */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Fallback if biometric fails</p>
        <form.Field name="fallbackMethod" validators={{ onChange: fallbackMethodSchema }}>
          {(field) => (
            <div className="flex gap-2">
              {FALLBACK_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <FormButton className="w-full">Enable Biometrics</FormButton>
    </Form>
  );
}
