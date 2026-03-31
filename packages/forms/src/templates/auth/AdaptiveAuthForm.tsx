'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { adaptiveAuthSchema, type AdaptiveAuthFormData } from '../../schemas/index';
import { ControlledInput, ControlledCheckbox } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface AdaptiveAuthFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: AdaptiveAuthFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<AdaptiveAuthFormData>;
  /** Risk level for display — does not affect validation */
  riskLevel?: 'low' | 'medium' | 'high';
  /** Type of challenge rendered */
  challengeType?: 'captcha' | 'security-question' | 'email-pin' | 'sms-pin';
}

const TRUST_DURATION_OPTIONS = [
  { value: 'session', label: 'This session' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
] as const;

const RISK_BADGE: Record<
  NonNullable<AdaptiveAuthFormProps['riskLevel']>,
  { label: string; className: string }
> = {
  low: { label: 'Low Risk', className: 'bg-green-500/10 text-green-600 border-green-500/30' },
  medium: {
    label: 'Medium Risk',
    className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
  },
  high: { label: 'High Risk', className: 'bg-red-500/10 text-red-600 border-red-500/30' },
};

const CHALLENGE_LABEL: Record<NonNullable<AdaptiveAuthFormProps['challengeType']>, string> = {
  captcha: 'Complete the CAPTCHA to continue',
  'security-question': 'Answer your security question',
  'email-pin': 'Enter the PIN sent to your email',
  'sms-pin': 'Enter the PIN sent via SMS',
};

export function AdaptiveAuthForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  riskLevel = 'medium',
  challengeType = 'email-pin',
}: AdaptiveAuthFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      challengeResponse: '',
      trustDevice: false,
      trustDuration: 'session' as const,
      ...defaultValues,
    } as AdaptiveAuthFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = adaptiveAuthSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const badge = RISK_BADGE[riskLevel];

  return (
    <Form
      form={form}
      variant={variant}
      className={cn('max-w-sm space-y-4', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
            badge.className,
          )}
        >
          {badge.label}
        </span>
        <span className="text-xs text-muted-foreground">Adaptive security challenge triggered</span>
      </div>

      <p className="text-sm text-muted-foreground">{CHALLENGE_LABEL[challengeType]}</p>

      <ControlledInput
        name="challengeResponse"
        label="Response"
        placeholder={challengeType.includes('pin') ? '123456' : 'Your answer…'}
        required
        validators={{ onChange: adaptiveAuthSchema.shape.challengeResponse }}
      />

      <ControlledCheckbox name="trustDevice" label="Trust this device" />

      <form.Subscribe selector={(state: any) => state.values.trustDevice}>
        {(trustDevice) =>
          trustDevice ? (
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
          ) : null
        }
      </form.Subscribe>

      <FormButton className="w-full">Continue</FormButton>
    </Form>
  );
}
