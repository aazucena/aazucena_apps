'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { invoiceDisputeSchema, type InvoiceDisputeFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface InvoiceDisputeFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: InvoiceDisputeFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<InvoiceDisputeFormData>;
}

const DISPUTE_TYPE_OPTIONS = [
  { value: 'incorrect_amount', label: 'Incorrect Amount' },
  { value: 'duplicate', label: 'Duplicate Invoice' },
  { value: 'not_received', label: 'Not Received' },
  { value: 'service_not_rendered', label: 'Service Not Rendered' },
  { value: 'other', label: 'Other' },
] as const;

export function InvoiceDisputeForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: InvoiceDisputeFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      invoiceId: '',
      disputeType: 'incorrect_amount' as const,
      amountDisputed: undefined,
      explanation: '',
      ...defaultValues,
    } as InvoiceDisputeFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = invoiceDisputeSchema.parse(value);
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

      <ControlledInput
        name="invoiceId"
        label="Invoice ID"
        placeholder="INV-XXXXXX"
        required
        validators={{ onChange: invoiceDisputeSchema.shape.invoiceId }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Dispute Type</p>
        <form.Field name="disputeType">
          {(field) => (
            <div className="grid grid-cols-2 gap-2">
              {DISPUTE_TYPE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'rounded-md border px-3 py-2 text-xs font-medium text-left transition-all',
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
        name="amountDisputed"
        label="Amount Disputed ($)"
        type="number"
        min="0"
        step="0.01"
        placeholder="0.00"
        description="Leave blank if the full invoice amount is disputed"
      />

      <ControlledTextarea
        name="explanation"
        label="Explanation"
        placeholder="Please explain the nature of the dispute in detail…"
        required
        validators={{ onChange: invoiceDisputeSchema.shape.explanation }}
      />

      <FormButton className="w-full">File Dispute</FormButton>
    </Form>
  );
}
