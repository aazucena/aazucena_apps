'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { alertConfigSchema, type AlertConfigFormData } from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface AlertConfigFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: AlertConfigFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<AlertConfigFormData>;
  availableMetrics?: string[];
}

const DEFAULT_METRICS = [
  'error_rate',
  'p95_latency',
  'requests_per_second',
  'cpu_usage',
  'memory_usage',
];

export function AlertConfigForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  availableMetrics = DEFAULT_METRICS,
}: AlertConfigFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      alertName: '',
      metric: '',
      operator: '>' as const,
      threshold: 0,
      notificationChannel: 'Email' as const,
      notificationTarget: '',
      cooldownMinutes: 60,
      ...defaultValues,
    } as AlertConfigFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(alertConfigSchema.parse(value));
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);
  return (
    <Form
      form={form}
      variant={variant}
      className={cn('max-w-lg space-y-4', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />
      <ControlledInput
        name="alertName"
        label="Alert Name"
        placeholder="High Error Rate"
        required
        validators={{ onChange: alertConfigSchema.shape.alertName }}
      />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="metric"
          label="Metric"
          placeholder="error_rate"
          required
          validators={{ onChange: alertConfigSchema.shape.metric }}
        />
        <ControlledInput
          name="threshold"
          label="Threshold"
          type="number"
          placeholder="5"
          required
        />
      </div>
      <ControlledInput
        name="notificationTarget"
        label="Notify"
        placeholder="you@example.com or webhook URL"
        required
        validators={{ onChange: alertConfigSchema.shape.notificationTarget }}
      />
      <ControlledInput
        name="cooldownMinutes"
        label="Cooldown (minutes)"
        type="number"
        placeholder="60"
      />
      <FormButton className="w-full">Create Alert</FormButton>
    </Form>
  );
}
