'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { z } from 'zod';
import { accountDeletionSchema, type AccountDeletionFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface AccountDeletionFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: AccountDeletionFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<AccountDeletionFormData>;
}

const REASON_OPTIONS = [
  { value: 'no_longer_needed', label: 'No longer needed' },
  { value: 'switching_service', label: 'Switching to another service' },
  { value: 'privacy_concerns', label: 'Privacy concerns' },
  { value: 'too_expensive', label: 'Too expensive' },
  { value: 'other', label: 'Other reason' },
] as const;

export function AccountDeletionForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: AccountDeletionFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      reason: 'no_longer_needed' as const,
      otherReason: '',
      confirmEmail: '',
      exportDataFirst: false,
      acknowledgeIrreversible: false,
      ...defaultValues,
    } as AccountDeletionFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(accountDeletionSchema.parse(value));
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

      {/* Danger warning banner */}
      <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive dark:border-destructive/50 dark:bg-destructive/20">
        <p className="font-semibold">This action is permanent and cannot be undone.</p>
        <p className="mt-1 text-xs opacity-90">
          All your data, including projects, history, and settings, will be permanently erased.
        </p>
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Why are you deleting your account? <span className="text-destructive">*</span>
        </p>
        <form.Field name="reason" validators={{ onChange: accountDeletionSchema.shape.reason }}>
          {(field) => (
            <div className="space-y-2">
              {REASON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.handleChange(opt.value)}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md border px-3 py-2.5 text-left text-sm font-medium transition-all',
                    field.state.value === opt.value
                      ? 'border-destructive bg-destructive/10 text-destructive'
                      : 'border-border bg-background hover:border-destructive/40',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px]',
                      field.state.value === opt.value
                        ? 'border-destructive bg-destructive text-white'
                        : 'border-muted-foreground',
                    )}
                  >
                    {field.state.value === opt.value ? '●' : ''}
                  </span>
                  {opt.label}
                </button>
              ))}
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Conditional: other reason textarea */}
      <form.Subscribe selector={(state: any) => state.values.reason}>
        {(reason) =>
          reason === 'other' ? (
            <form.Field
              name="otherReason"
              validators={{ onChange: accountDeletionSchema.shape.otherReason }}
            >
              {(field) => (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Please tell us more</label>
                  <textarea
                    className="w-full resize-none rounded-md border border-border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-destructive/30"
                    rows={3}
                    placeholder="Describe your reason…"
                    value={(field.state.value as string) || ''}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </form.Field>
          ) : null
        }
      </form.Subscribe>

      <ControlledInput
        name="confirmEmail"
        label="Confirm your email address"
        type="email"
        placeholder="Enter the email linked to this account"
        required
        validators={{ onChange: accountDeletionSchema.shape.confirmEmail }}
      />

      <div className="space-y-3 rounded-md border border-border bg-muted/30 px-4 py-3">
        <ControlledCheckbox
          name="exportDataFirst"
          label="I have exported my data before deleting"
          description="You can download your data from Settings > Export before proceeding."
        />
        {/* acknowledgeIrreversible: ZodBoolean with .refine() — no validators prop */}
        <ControlledCheckbox
          name="acknowledgeIrreversible"
          label="I understand this deletion is permanent and irreversible"
          required
        />
      </div>

      <FormButton
        className="w-full border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90"
        variant="default"
      >
        Permanently Delete Account
      </FormButton>
    </Form>
  );
}
