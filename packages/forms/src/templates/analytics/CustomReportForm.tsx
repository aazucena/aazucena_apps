'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { customReportSchema, type CustomReportFormData } from '../../schemas/index';
import { ControlledInput } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface CustomReportFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: CustomReportFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<CustomReportFormData>;
  availableMetrics?: string[];
}

const DEFAULT_METRICS = [
  'page_views',
  'unique_visitors',
  'bounce_rate',
  'avg_session',
  'conversions',
  'error_rate',
];

export function CustomReportForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  availableMetrics = DEFAULT_METRICS,
}: CustomReportFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      reportName: '',
      dateRangeStart: '',
      dateRangeEnd: '',
      metrics: [] as string[],
      groupBy: 'Day' as const,
      outputFormat: 'CSV' as const,
      email: '',
      ...defaultValues,
    } as CustomReportFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(customReportSchema.parse(value));
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
        name="reportName"
        label="Report Name"
        placeholder="Monthly Summary"
        required
        validators={{ onChange: customReportSchema.shape.reportName }}
      />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="dateRangeStart" label="Start Date" type="date" required />
        <ControlledInput name="dateRangeEnd" label="End Date" type="date" required />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Metrics</p>
        <div className="flex flex-wrap gap-2">
          {availableMetrics.map((m) => (
            <form.Field key={m} name="metrics">
              {(field) => {
                const sel = ((field.state.value as string[]) ?? []).includes(m);
                return (
                  <button
                    type="button"
                    onClick={() => {
                      const cur = (field.state.value as string[]) ?? [];
                      field.handleChange(sel ? cur.filter((x) => x !== m) : [...cur, m]);
                    }}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-mono font-medium transition-all',
                      sel
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50',
                    )}
                  >
                    {m}
                  </button>
                );
              }}
            </form.Field>
          ))}
        </div>
      </div>
      <ControlledInput
        name="email"
        label="Deliver to Email"
        type="email"
        placeholder="you@example.com"
        required
        validators={{ onChange: customReportSchema.shape.email }}
      />
      <FormButton className="w-full">Generate Report</FormButton>
    </Form>
  );
}
