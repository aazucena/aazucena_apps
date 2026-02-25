'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { dataExportSchema, type DataExportFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface DataExportRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: DataExportFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<DataExportFormData>;
}

const FORMAT_OPTIONS = [
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
  { value: 'pdf', label: 'PDF' },
  { value: 'all', label: 'All Formats' },
] as const;

const DATA_CATEGORY_OPTIONS = ['profile', 'posts', 'messages', 'analytics', 'payments', 'all'];

const DELIVERY_OPTIONS = [
  { value: 'email', label: 'Email' },
  { value: 'download_link', label: 'Download Link' },
] as const;

export function DataExportRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: DataExportRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      format: 'json' as const,
      dataCategories: [],
      deliveryMethod: 'email' as const,
      encryptExport: false,
      verifyIdentity: false,
      ...defaultValues,
    } as DataExportFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = dataExportSchema.parse(value);
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
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      <div className="space-y-2">
        <p className="text-sm font-medium">Export Format</p>
        <form.Field name="format">
          {(field) => (
            <div className="flex gap-2 flex-wrap">
              {FORMAT_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'rounded-md border px-3 py-1.5 text-xs font-medium transition-all',
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
        <p className="text-sm font-medium">Data Categories</p>
        <p className="text-xs text-muted-foreground">Select which data to include in the export</p>
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
                        const next = isSelected
                          ? selected.filter((c) => c !== cat)
                          : [...selected, cat];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50',
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

      <div className="space-y-2">
        <p className="text-sm font-medium">Delivery Method</p>
        <form.Field name="deliveryMethod">
          {(field) => (
            <div className="flex gap-2">
              {DELIVERY_OPTIONS.map(({ value, label }) => (
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

      <ControlledCheckbox
        name="encryptExport"
        label="Encrypt exported file"
        description="We'll send you a decryption key separately"
      />

      <ControlledCheckbox
        name="verifyIdentity"
        label="I confirm this is my account and I authorize this export"
        required
      />

      <FormButton className="w-full">Request Export</FormButton>
    </Form>
  );
}
