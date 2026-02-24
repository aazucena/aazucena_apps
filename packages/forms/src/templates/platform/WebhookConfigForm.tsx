'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { webhookConfigSchema, type WebhookConfigFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledSwitch } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface WebhookConfigFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: WebhookConfigFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<WebhookConfigFormData>;
}

const EVENT_OPTIONS = ['push', 'deploy', 'alert', 'user', 'payment'];

const RETRY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: '3x', label: '3x' },
  { value: '5x', label: '5x' },
] as const;

const FORMAT_OPTIONS = [
  { value: 'json', label: 'JSON' },
  { value: 'form', label: 'Form-encoded' },
] as const;

export function WebhookConfigForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: WebhookConfigFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      url: '',
      events: [],
      secret: '',
      retryPolicy: '3x' as const,
      format: 'json' as const,
      sslVerify: true,
      ...defaultValues,
    } as WebhookConfigFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = webhookConfigSchema.parse(value);
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
      className={cn('max-w-md space-y-4', className)}
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
    >
      <FormErrorSummary />

      <ControlledInput
        name="url"
        label="Webhook URL"
        type="url"
        placeholder="https://example.com/webhook"
        required
        validators={{ onChange: webhookConfigSchema.shape.url }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Events</p>
        <form.Field name="events">
          {(field) => {
            const selected: string[] = (field.state.value as string[]) || [];
            return (
              <div className="flex flex-wrap gap-2">
                {EVENT_OPTIONS.map((evt) => {
                  const isSelected = selected.includes(evt);
                  return (
                    <button
                      key={evt}
                      type="button"
                      onClick={() => {
                        const next = isSelected ? selected.filter((e) => e !== evt) : [...selected, evt];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all',
                        isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                      )}
                    >
                      {evt}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>

      <ControlledInput
        name="secret"
        label="Signing Secret"
        type="password"
        placeholder="whsec_xxxxxxxxxxxxxxxx"
        description="Used to sign payloads (HMAC-SHA256). Optional but recommended."
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <p className="text-xs font-medium">Retry Policy</p>
          <form.Field name="retryPolicy">
            {(field) => (
              <div className="flex gap-1.5">
                {RETRY_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.handleChange(value)}
                    className={cn(
                      'flex-1 rounded-md border py-1.5 text-xs font-medium transition-all',
                      field.state.value === value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </form.Field>
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-medium">Payload Format</p>
          <form.Field name="format">
            {(field) => (
              <div className="flex gap-1.5">
                {FORMAT_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.handleChange(value)}
                    className={cn(
                      'flex-1 rounded-md border py-1.5 text-xs font-medium transition-all',
                      field.state.value === value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      <ControlledSwitch
        name="sslVerify"
        label="Verify SSL Certificate"
        description="Disable only for self-signed certificates in development"
      />

      <FormButton className="w-full">Save Webhook</FormButton>
    </Form>
  );
}
