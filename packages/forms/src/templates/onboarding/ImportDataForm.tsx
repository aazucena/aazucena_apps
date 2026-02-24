'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { importDataSchema, type ImportDataFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface ImportDataFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ImportDataFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ImportDataFormData>;
}

const SOURCE_OPTIONS = [
  { value: 'csv', label: 'CSV', needsKey: false },
  { value: 'json', label: 'JSON', needsKey: false },
  { value: 'postgres', label: 'PostgreSQL', needsKey: true },
  { value: 'mysql', label: 'MySQL', needsKey: true },
  { value: 'airtable', label: 'Airtable', needsKey: true },
  { value: 'notion', label: 'Notion', needsKey: true },
  { value: 'sheets', label: 'Google Sheets', needsKey: true },
] as const;

const CONFLICT_OPTIONS = [
  { value: 'skip', label: 'Skip Duplicates' },
  { value: 'overwrite', label: 'Overwrite' },
  { value: 'merge', label: 'Merge' },
] as const;

export function ImportDataForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ImportDataFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      sourceSystem: 'csv' as const,
      apiKey: '',
      fieldMapping: '',
      conflictResolution: 'skip' as const,
      ...defaultValues,
    } as ImportDataFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = importDataSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'source',
      title: 'Source',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <div className="space-y-2">
            <p className="text-sm font-medium">Source System</p>
            <form.Field name="sourceSystem">
              {(field) => (
                <div className="grid grid-cols-3 gap-2">
                  {SOURCE_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.handleChange(value)}
                      className={cn(
                        'rounded-md border px-3 py-2 text-xs font-medium transition-all',
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
          <form.Subscribe selector={(state: any) => state.values.sourceSystem}>
            {(source) => {
              const opt = SOURCE_OPTIONS.find((o) => o.value === source);
              return opt?.needsKey ? (
                <ControlledInput
                  name="apiKey"
                  label="API Key / Connection String"
                  placeholder="Enter your API key or connection string"
                  type="password"
                />
              ) : null;
            }}
          </form.Subscribe>
        </div>
      ),
    },
    {
      id: 'mapping',
      title: 'Mapping',
      component: (
        <div className="space-y-4">
          <ControlledTextarea
            name="fieldMapping"
            label="Field Mapping"
            placeholder={'source_column -> target_field\nname -> display_name\nemail -> contact_email'}
            description="Map source columns to target fields (one mapping per line)"
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Conflict Resolution</p>
            <form.Field name="conflictResolution">
              {(field) => (
                <div className="flex gap-2">
                  {CONFLICT_OPTIONS.map(({ value, label }) => (
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
        </div>
      ),
    },
  ];

  return (
    <Form form={form} variant={variant} className={cn('max-w-lg', className)} onSubmit={(e) => e.preventDefault()}>
      <FormWizard steps={steps} onComplete={async () => { await form.handleSubmit(); }} showChallenge={false} />
    </Form>
  );
}
