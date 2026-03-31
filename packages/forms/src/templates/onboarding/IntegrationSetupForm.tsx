'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { integrationSetupSchema, type IntegrationSetupFormData } from '../../schemas/index';
import { ControlledInput } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface IntegrationSetupFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: IntegrationSetupFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<IntegrationSetupFormData>;
}

const INTEGRATION_OPTIONS = [
  { value: 'GitHub', label: 'GitHub', initials: 'GH', color: 'bg-slate-800 text-slate-100' },
  { value: 'Slack', label: 'Slack', initials: 'SL', color: 'bg-purple-600 text-white' },
  { value: 'Jira', label: 'Jira', initials: 'JR', color: 'bg-blue-600 text-white' },
  { value: 'Notion', label: 'Notion', initials: 'NT', color: 'bg-zinc-800 text-white' },
  { value: 'Linear', label: 'Linear', initials: 'LN', color: 'bg-indigo-600 text-white' },
] as const;

const AUTH_OPTIONS = [
  { value: 'oauth', label: 'OAuth' },
  { value: 'token', label: 'API Token' },
] as const;

const SYNC_DIRECTION_OPTIONS = [
  { value: 'one_way', label: 'One Way' },
  { value: 'two_way', label: 'Two Way' },
] as const;

const SYNC_FREQUENCY_OPTIONS = [
  { value: 'realtime', label: 'Real-time' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
] as const;

export function IntegrationSetupForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: IntegrationSetupFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      integration: 'GitHub' as const,
      authMethod: 'oauth' as const,
      webhookUrl: '',
      syncDirection: 'one_way' as const,
      syncFrequency: 'realtime' as const,
      ...defaultValues,
    } as IntegrationSetupFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = integrationSetupSchema.parse(value);
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
      className={cn('max-w-lg space-y-6', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Select Integration</p>
        <form.Field name="integration">
          {(field) => (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {INTEGRATION_OPTIONS.map(({ value, label, initials, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex flex-col items-center rounded-md border px-2 py-3 text-center transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-md text-[11px] font-bold',
                      color,
                    )}
                  >
                    {initials}
                  </span>
                  <span
                    className={cn(
                      'mt-1.5 text-xs font-medium',
                      field.state.value === value && 'text-primary',
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

      <div className="space-y-2">
        <p className="text-sm font-semibold">Authentication Method</p>
        <form.Field name="authMethod">
          {(field) => (
            <div className="flex gap-2">
              {AUTH_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all',
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

      <form.Subscribe selector={(state: any) => state.values.authMethod}>
        {(authMethod) =>
          authMethod === 'token' ? (
            <ControlledInput
              name="webhookUrl"
              label="Webhook URL"
              type="url"
              placeholder="https://your-service.example.com/webhook"
              description="Endpoint that will receive integration events"
              validators={{ onChange: integrationSetupSchema.shape.webhookUrl }}
            />
          ) : null
        }
      </form.Subscribe>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Sync Direction</p>
        <form.Field name="syncDirection">
          {(field) => (
            <div className="flex gap-2">
              {SYNC_DIRECTION_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all',
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

      <div className="space-y-2">
        <p className="text-sm font-semibold">Sync Frequency</p>
        <form.Field name="syncFrequency">
          {(field) => (
            <div className="flex gap-2">
              {SYNC_FREQUENCY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all',
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

      <FormButton className="w-full">Connect Integration</FormButton>
    </Form>
  );
}
