'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { environmentVariablesSchema, type EnvironmentVariablesFormData } from '../../schemas/index.js';
import { ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface EnvironmentVariablesFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: EnvironmentVariablesFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<EnvironmentVariablesFormData>;
}

const ENV_OPTIONS = [
  { value: 'dev', label: 'Dev', activeClass: 'border-green-500/50 bg-green-500/10 text-green-600' },
  { value: 'staging', label: 'Staging', activeClass: 'border-amber-500/50 bg-amber-500/10 text-amber-600' },
  { value: 'prod', label: 'Production', activeClass: 'border-red-500/50 bg-red-500/10 text-red-600' },
] as const;

const SYNC_OPTIONS = ['dev', 'staging', 'prod'];

export function EnvironmentVariablesForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: EnvironmentVariablesFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      environment: 'dev' as const,
      variables: '',
      syncTo: [],
      overrideExisting: false,
      ...defaultValues,
    } as EnvironmentVariablesFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = environmentVariablesSchema.parse(value);
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

      <div className="space-y-2">
        <p className="text-sm font-medium">Target Environment</p>
        <form.Field name="environment">
          {(field) => (
            <div className="flex gap-2">
              {ENV_OPTIONS.map(({ value, label, activeClass }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-bold transition-all',
                    field.state.value === value ? activeClass : 'border-border hover:border-primary/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledTextarea
        name="variables"
        label="Variables"
        placeholder={'DATABASE_URL=postgres://localhost:5432/mydb\nAPI_KEY=sk_test_xxxx\nNODE_ENV=development'}
        description="One variable per line: KEY=value. Sensitive values will be masked after saving."
        required
        validators={{ onChange: environmentVariablesSchema.shape.variables }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Sync To</p>
        <p className="text-xs text-muted-foreground">Optionally propagate these variables to other environments</p>
        <form.Field name="syncTo">
          {(field) => {
            const currentEnv = (form as any).state?.values?.environment || 'dev';
            const available = SYNC_OPTIONS.filter((e) => e !== currentEnv);
            const selected: string[] = (field.state.value as string[]) || [];
            return (
              <div className="flex gap-2">
                {available.map((env) => {
                  const isSelected = selected.includes(env);
                  const opt = ENV_OPTIONS.find((o) => o.value === env);
                  return (
                    <button
                      key={env}
                      type="button"
                      onClick={() => {
                        const next = isSelected ? selected.filter((e) => e !== env) : [...selected, env];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'flex-1 rounded-md border px-3 py-2 text-xs font-medium capitalize transition-all',
                        isSelected && opt ? opt.activeClass : 'border-border hover:border-primary/50'
                      )}
                    >
                      {env}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>

      <ControlledCheckbox
        name="overrideExisting"
        label="Override existing variables"
        description="Overwrite variables that share the same key name"
      />

      <FormButton className="w-full">Apply Variables</FormButton>
    </Form>
  );
}
