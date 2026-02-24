'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { notificationPrefsSchema, type NotificationPrefsFormData } from '../../schemas/index.js';
import { ControlledSwitch } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface NotificationPreferencesFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: NotificationPrefsFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<NotificationPrefsFormData>;
}

const FREQUENCY_OPTIONS = [
  { value: 'immediate', label: 'Immediate' },
  { value: 'daily', label: 'Daily Digest' },
  { value: 'weekly', label: 'Weekly Summary' },
] as const;

export function NotificationPreferencesForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: NotificationPreferencesFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      marketing: false,
      security: true,
      product: true,
      social: false,
      frequency: 'immediate' as const,
      emailEnabled: true,
      pushEnabled: false,
      inAppEnabled: true,
      ...defaultValues,
    } as NotificationPrefsFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = notificationPrefsSchema.parse(value);
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
      className={cn('max-w-md space-y-6', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      <div className="space-y-3">
        <p className="text-sm font-semibold">Notification Categories</p>
        <div className="space-y-3 rounded-md border border-border p-4">
          <ControlledSwitch
            name="security"
            label="Security Alerts"
            description="Sign-ins, password changes, and suspicious activity"
            validators={{ onChange: notificationPrefsSchema.shape.security }}
          />
          <ControlledSwitch
            name="product"
            label="Product Updates"
            description="New features, improvements, and announcements"
            validators={{ onChange: notificationPrefsSchema.shape.product }}
          />
          <ControlledSwitch
            name="marketing"
            label="Marketing &amp; Promotions"
            description="Offers, newsletters, and promotional content"
            validators={{ onChange: notificationPrefsSchema.shape.marketing }}
          />
          <ControlledSwitch
            name="social"
            label="Social Activity"
            description="Mentions, comments, and team activity"
            validators={{ onChange: notificationPrefsSchema.shape.social }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Delivery Frequency</p>
        <form.Field name="frequency">
          {(field) => (
            <div className="flex gap-2">
              {FREQUENCY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all',
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

      <div className="space-y-3">
        <p className="text-sm font-semibold">Delivery Channels</p>
        <div className="space-y-3 rounded-md border border-border p-4">
          <ControlledSwitch
            name="emailEnabled"
            label="Email"
            description="Receive notifications via email"
            validators={{ onChange: notificationPrefsSchema.shape.emailEnabled }}
          />
          <ControlledSwitch
            name="pushEnabled"
            label="Push Notifications"
            description="Browser and mobile push notifications"
            validators={{ onChange: notificationPrefsSchema.shape.pushEnabled }}
          />
          <ControlledSwitch
            name="inAppEnabled"
            label="In-App"
            description="Notifications inside the application"
            validators={{ onChange: notificationPrefsSchema.shape.inAppEnabled }}
          />
        </div>
      </div>

      <FormButton className="w-full">Save Preferences</FormButton>
    </Form>
  );
}
