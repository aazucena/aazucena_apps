'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { statusSubscriptionSchema, type StatusSubscriptionFormData } from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface StatusSubscriptionFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: StatusSubscriptionFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<StatusSubscriptionFormData>;
}

const NOTIFY_OPTIONS = [
  { value: 'incident', label: 'Incidents', description: 'Outages and service disruptions' },
  { value: 'maintenance', label: 'Maintenance', description: 'Scheduled downtime windows' },
  { value: 'resolved', label: 'Resolved', description: 'When issues are fixed' },
] as const;

const SERVICE_OPTIONS = ['API', 'Dashboard', 'CDN', 'Database', 'Auth'] as const;

const DELIVERY_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'webhook', label: 'Webhook' },
  { value: 'sms', label: 'SMS' },
] as const;

export function StatusSubscriptionForm({ variant = 'default', onSuccess, onError, className, defaultValues }: StatusSubscriptionFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      email: '',
      notifyOn: ['incident'] as Array<'incident' | 'maintenance' | 'resolved'>,
      services: [] as string[],
      deliveryMethod: 'email' as const,
      webhookUrl: '',
      ...defaultValues,
    } as StatusSubscriptionFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(statusSubscriptionSchema.parse(value)); } catch (error) { onError?.(error); }
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
        name="email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        required
        validators={{ onChange: statusSubscriptionSchema.shape.email }}
      />

      {/* Notify on — multiselect checkboxes */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Notify me on</p>
        <form.Field name="notifyOn" validators={{ onChange: statusSubscriptionSchema.shape.notifyOn }}>
          {(field) => (
            <div className="space-y-2">
              {NOTIFY_OPTIONS.map((opt) => {
                const current = (field.state.value as string[]) ?? [];
                const checked = current.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      field.handleChange(
                        checked
                          ? current.filter((v) => v !== opt.value)
                          : [...current, opt.value]
                      );
                    }}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-all',
                      checked
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background hover:border-primary/40'
                    )}
                  >
                    <span className={cn(
                      'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-xs font-bold',
                      checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border'
                    )}>
                      {checked ? '✓' : ''}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{opt.label}</span>
                      <span className="block text-xs text-muted-foreground">{opt.description}</span>
                    </span>
                  </button>
                );
              })}
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Services — tag-like button toggles */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Services to monitor</p>
        <form.Field name="services" validators={{ onChange: statusSubscriptionSchema.shape.services }}>
          {(field) => (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((svc) => {
                  const current = (field.state.value as string[]) ?? [];
                  const active = current.includes(svc);
                  return (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => {
                        field.handleChange(
                          active ? current.filter((s) => s !== svc) : [...current, svc]
                        );
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                        active
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background text-foreground hover:border-primary/50'
                      )}
                    >
                      {svc}
                    </button>
                  );
                })}
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Delivery method — radio buttons */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Delivery method</p>
        <form.Field name="deliveryMethod" validators={{ onChange: statusSubscriptionSchema.shape.deliveryMethod }}>
          {(field) => (
            <div className="flex gap-2">
              {DELIVERY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.handleChange(opt.value)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium transition-all',
                    field.state.value === opt.value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/50'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      {/* Conditional webhook URL */}
      <form.Subscribe selector={(state: any) => state.values.deliveryMethod}>
        {(method) =>
          method === 'webhook' ? (
            <ControlledInput
              name="webhookUrl"
              label="Webhook URL"
              type="url"
              placeholder="https://hooks.example.com/status"
              validators={{ onChange: statusSubscriptionSchema.shape.webhookUrl }}
            />
          ) : null
        }
      </form.Subscribe>

      <FormButton className="w-full">Subscribe to Updates</FormButton>
    </Form>
  );
}
