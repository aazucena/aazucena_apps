'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { accessRequestSchema, type AccessRequestFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface AccessRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: AccessRequestFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<AccessRequestFormData>;
}

const RESOURCE_OPTIONS = [
  { value: 'repo', label: 'Repository' },
  { value: 'environment', label: 'Environment' },
  { value: 'database', label: 'Database' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'tool', label: 'Tool' },
] as const;

const ACCESS_LEVEL_OPTIONS = [
  { value: 'read', label: 'Read', color: 'text-blue-500' },
  { value: 'write', label: 'Write', color: 'text-amber-500' },
  { value: 'admin', label: 'Admin', color: 'text-red-500' },
] as const;

export function AccessRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: AccessRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      resourceType: 'repo' as const,
      resourceId: '',
      accessLevel: 'read' as const,
      justification: '',
      duration: 'permanent' as const,
      approver: '',
      ...defaultValues,
    } as AccessRequestFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = accessRequestSchema.parse(value);
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
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      <div className="space-y-2">
        <p className="text-sm font-medium">Resource Type</p>
        <form.Field name="resourceType">
          {(field) => (
            <div className="flex flex-wrap gap-2">
              {RESOURCE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
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

      <ControlledInput
        name="resourceId"
        label="Resource ID"
        placeholder="e.g. org/repo-name or db-production"
        required
        validators={{ onChange: accessRequestSchema.shape.resourceId }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Access Level</p>
        <form.Field name="accessLevel">
          {(field) => (
            <div className="flex gap-2">
              {ACCESS_LEVEL_OPTIONS.map(({ value, label, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all',
                    field.state.value === value
                      ? `border-primary bg-primary/10 ${color}`
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

      <ControlledTextarea
        name="justification"
        label="Justification"
        placeholder="Why do you need this access?"
        required
        validators={{ onChange: accessRequestSchema.shape.justification }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Duration</p>
        <form.Field name="duration">
          {(field) => (
            <div className="flex gap-2">
              {(['temporary', 'permanent'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => field.handleChange(d)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-medium capitalize transition-all',
                    field.state.value === d
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledInput
        name="approver"
        label="Approver"
        placeholder="manager@company.com"
        description="Optional — tag a manager to expedite approval"
      />

      <FormButton className="w-full">Submit Request</FormButton>
    </Form>
  );
}
