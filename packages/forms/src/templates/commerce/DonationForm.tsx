'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { donationSchema, type DonationFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface DonationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: DonationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<DonationFormData>;
  presets?: number[];
}

const DEFAULT_PRESETS = [5, 10, 25, 50];

export function DonationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  presets = DEFAULT_PRESETS,
}: DonationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      amount: presets[1] ?? 10,
      frequency: 'one-time' as const,
      message: '',
      anonymous: false,
      email: '',
      name: '',
      ...defaultValues,
    } as DonationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = donationSchema.parse(value);
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
        <p className="text-sm font-medium">Amount</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((preset) => (
            <form.Field key={preset} name="amount">
              {(field) => (
                <button
                  type="button"
                  onClick={() => field.handleChange(preset)}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-sm font-semibold transition-all',
                    field.state.value === preset
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/50',
                  )}
                >
                  ${preset}
                </button>
              )}
            </form.Field>
          ))}
        </div>
      </div>
      <ControlledInput
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        validators={{ onChange: donationSchema.shape.email }}
      />
      <ControlledInput name="name" label="Name" placeholder="Optional" />
      <ControlledInput name="message" label="Message" placeholder="Leave a note (optional)" />
      <ControlledCheckbox name="anonymous" label="Donate anonymously" />
      <FormButton className="w-full">Donate</FormButton>
    </Form>
  );
}
