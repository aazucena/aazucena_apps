'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { dataDeletionSchema, type DataDeletionFormData } from '../../schemas/index.js';
import { ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface DataDeletionRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: DataDeletionFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<DataDeletionFormData>;
}

const DATA_CATEGORY_OPTIONS = ['profile', 'posts', 'analytics', 'payments', 'messages', 'all'];

export function DataDeletionRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: DataDeletionRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      requestType: 'full' as const,
      dataCategories: [],
      reason: '',
      confirmIdentity: false,
      retainForLegal: false,
      ...defaultValues,
    } as DataDeletionFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = dataDeletionSchema.parse(value);
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

      <div className="space-y-2">
        <p className="text-sm font-medium">Request Type</p>
        <form.Field name="requestType">
          {(field) => (
            <div className="flex gap-2">
              {([
                { value: 'full', label: 'Full Deletion', description: 'Delete all my data' },
                { value: 'partial', label: 'Partial Deletion', description: 'Delete selected categories' },
              ] as const).map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-all',
                    field.state.value === value ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className={cn('text-xs font-bold', field.state.value === value && 'text-primary')}>{label}</span>
                  <span className="text-[11px] text-muted-foreground">{description}</span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Data Categories</p>
        <form.Field name="dataCategories">
          {(field) => {
            const selected: string[] = (field.state.value as string[]) || [];
            return (
              <div className="flex flex-wrap gap-2">
                {DATA_CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = selected.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        const next = isSelected ? selected.filter((c) => c !== cat) : [...selected, cat];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all',
                        isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                      )}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>

      <ControlledTextarea
        name="reason"
        label="Reason for Deletion"
        placeholder="Please state your reason for this request…"
        required
        validators={{ onChange: dataDeletionSchema.shape.reason }}
      />

      <ControlledCheckbox
        name="retainForLegal"
        label="Retain data that may be needed for legal compliance"
        description="Some data may be retained for regulatory purposes"
      />

      <ControlledCheckbox
        name="confirmIdentity"
        label="I confirm this is my account and I authorize this deletion"
        required
      />

      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
        <strong>Warning:</strong> This action may be irreversible. Your data will be scheduled for deletion within 30 days.
      </div>

      <FormButton className="w-full">Submit Deletion Request</FormButton>
    </Form>
  );
}
