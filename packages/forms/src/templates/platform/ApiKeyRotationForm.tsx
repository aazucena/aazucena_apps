'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { apiKeyRotationSchema, type ApiKeyRotationFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface ApiKeyRotationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ApiKeyRotationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ApiKeyRotationFormData>;
}

const REASON_OPTIONS = [
  { value: 'routine', label: 'Routine Rotation' },
  { value: 'suspected_compromise', label: 'Suspected Compromise' },
  { value: 'employee_offboarding', label: 'Employee Offboarding' },
  { value: 'compliance', label: 'Compliance Requirement' },
  { value: 'other', label: 'Other' },
] as const;

const GRACE_PERIOD_OPTIONS = [
  { value: 'immediate', label: 'Immediate' },
  { value: '24h', label: '24 Hours' },
  { value: '72h', label: '72 Hours' },
  { value: '7d', label: '7 Days' },
] as const;

export function ApiKeyRotationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ApiKeyRotationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      keyId: '',
      rotationReason: 'routine' as const,
      gracePeriod: '24h' as const,
      notifyIntegrations: true,
      confirmRotate: false,
      ...defaultValues,
    } as ApiKeyRotationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = apiKeyRotationSchema.parse(value);
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
      className={cn('max-w-md space-y-5', className)}
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
    >
      <FormErrorSummary />

      <ControlledInput
        name="keyId"
        label="Key ID"
        placeholder="key_prod_abc123"
        required
        validators={{ onChange: apiKeyRotationSchema.shape.keyId }}
        description="The identifier of the API key to rotate"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Rotation Reason</p>
        <form.Field name="rotationReason">
          {(field) => (
            <div className="grid grid-cols-2 gap-2">
              {REASON_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'rounded-md border px-3 py-2 text-left text-xs font-medium transition-all',
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

      <div className="space-y-2">
        <p className="text-sm font-medium">Grace Period</p>
        <p className="text-xs text-muted-foreground">How long the old key remains valid after rotation</p>
        <form.Field name="gracePeriod">
          {(field) => (
            <div className="flex gap-2">
              {GRACE_PERIOD_OPTIONS.map(({ value, label }) => (
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

      <ControlledCheckbox
        name="notifyIntegrations"
        label="Notify connected integrations"
        description="Send rotation notice to all services using this key"
      />

      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
        <strong>Warning:</strong> This action cannot be undone. The old key will stop working after the grace period expires.
      </div>

      <ControlledCheckbox
        name="confirmRotate"
        label="I understand this will invalidate the current key"
        required
      />

      <FormButton className="w-full">Rotate API Key</FormButton>
    </Form>
  );
}
