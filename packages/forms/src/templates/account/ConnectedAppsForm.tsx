'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { connectedAppsSchema, type ConnectedAppsFormData } from '../../schemas/index.js';
import { ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface ConnectedAppsFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ConnectedAppsFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ConnectedAppsFormData>;
}

const PROVIDER_OPTIONS = [
  { value: 'google', label: 'Google', color: 'bg-red-500' },
  { value: 'github', label: 'GitHub', color: 'bg-zinc-800' },
  { value: 'slack', label: 'Slack', color: 'bg-purple-500' },
  { value: 'notion', label: 'Notion', color: 'bg-zinc-900' },
  { value: 'linear', label: 'Linear', color: 'bg-indigo-500' },
  { value: 'jira', label: 'Jira', color: 'bg-blue-500' },
  { value: 'figma', label: 'Figma', color: 'bg-pink-500' },
] as const;

const PERMISSION_OPTIONS = ['read', 'write', 'calendar', 'contacts', 'files', 'admin'];

export function ConnectedAppsForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ConnectedAppsFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      provider: 'github' as const,
      permissions: [],
      revokeOnSave: false,
      ...defaultValues,
    } as ConnectedAppsFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = connectedAppsSchema.parse(value);
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
        <p className="text-sm font-medium">Provider</p>
        <form.Field name="provider">
          {(field) => (
            <div className="grid grid-cols-4 gap-2">
              {PROVIDER_OPTIONS.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className={cn('h-4 w-4 rounded-full', color)} />
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Permissions</p>
        <p className="text-xs text-muted-foreground">Select the access levels to grant</p>
        <form.Field name="permissions">
          {(field) => {
            const selected: string[] = (field.state.value as string[]) || [];
            return (
              <div className="flex flex-wrap gap-2">
                {PERMISSION_OPTIONS.map((perm) => {
                  const isSelected = selected.includes(perm);
                  return (
                    <button
                      key={perm}
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? selected.filter((p) => p !== perm)
                          : [...selected, perm];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {perm}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>

      <ControlledCheckbox
        name="revokeOnSave"
        label="Revoke current permissions before applying"
        description="Useful when reducing permissions scope"
      />

      <FormButton className="w-full">Connect App</FormButton>
    </Form>
  );
}
