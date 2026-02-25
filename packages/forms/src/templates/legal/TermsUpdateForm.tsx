'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { termsUpdateSchema, type TermsUpdateFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface TermsUpdateFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: TermsUpdateFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<TermsUpdateFormData>;
  changesSummary?: string[];
}

const DEFAULT_CHANGES = [
  'Updated data retention policy (30 days → 90 days)',
  'New third-party integration permissions',
  'Revised liability clauses for enterprise users',
];

const OPTIONAL_CONSENTS = [
  { value: 'analytics_tracking', label: 'Analytics Tracking' },
  { value: 'personalized_content', label: 'Personalized Content' },
  { value: 'newsletter', label: 'Newsletter & Product Updates' },
];

export function TermsUpdateForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  changesSummary = DEFAULT_CHANGES,
}: TermsUpdateFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      hasRead: false,
      acceptAll: false,
      specificConsents: [],
      signature: '',
      ...defaultValues,
    } as TermsUpdateFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = termsUpdateSchema.parse(value);
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

      <div className="rounded-lg border bg-muted/40 p-4 space-y-2">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          What&apos;s Changed
        </p>
        <ul className="space-y-1.5">
          {changesSummary.map((change, i) => (
            <li key={i} className="flex items-start gap-2 text-xs">
              <span className="mt-0.5 text-primary">•</span>
              <span>{change}</span>
            </li>
          ))}
        </ul>
      </div>

      <ControlledCheckbox
        name="hasRead"
        label="I have read and understood the changes listed above"
        required
      />

      <ControlledCheckbox name="acceptAll" label="I accept the updated terms of service" required />

      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Optional Consents</p>
        <form.Field name="specificConsents">
          {(field) => {
            const selected: string[] = (field.state.value as string[]) || [];
            return (
              <div className="space-y-2">
                {OPTIONAL_CONSENTS.map(({ value, label }) => {
                  const isSelected = selected.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? selected.filter((c) => c !== value)
                          : [...selected, value];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-md border px-3 py-2 text-left text-xs transition-all',
                        isSelected
                          ? 'border-primary/50 bg-primary/5'
                          : 'border-border hover:border-primary/30',
                      )}
                    >
                      <div
                        className={cn(
                          'h-4 w-4 rounded border-2 flex items-center justify-center transition-all',
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground',
                        )}
                      >
                        {isSelected && (
                          <span className="text-primary-foreground text-[10px]">✓</span>
                        )}
                      </div>
                      {label}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>

      <ControlledInput
        name="signature"
        label="Electronic Signature"
        placeholder="Type your full name to sign"
        required
        validators={{ onChange: termsUpdateSchema.shape.signature }}
        description="By typing your name, you agree to the updated terms"
      />

      <FormButton className="w-full">Accept & Sign</FormButton>
    </Form>
  );
}
