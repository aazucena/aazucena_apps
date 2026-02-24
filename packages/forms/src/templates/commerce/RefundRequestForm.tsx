'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { refundRequestSchema, type RefundRequestFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface RefundRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: RefundRequestFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<RefundRequestFormData>;
  availableItems?: string[];
}

const DEFAULT_ITEMS = ['Item 1', 'Item 2', 'Item 3'];

const REASON_OPTIONS = [
  { value: 'defective', label: 'Defective' },
  { value: 'not_as_described', label: 'Not as Described' },
  { value: 'changed_mind', label: 'Changed Mind' },
  { value: 'duplicate', label: 'Duplicate Order' },
  { value: 'other', label: 'Other' },
] as const;

const RESOLUTION_OPTIONS = [
  { value: 'refund', label: 'Refund' },
  { value: 'store_credit', label: 'Store Credit' },
  { value: 'replacement', label: 'Replacement' },
] as const;

export function RefundRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  availableItems = DEFAULT_ITEMS,
}: RefundRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      orderId: '',
      items: [],
      reason: 'defective' as const,
      reasonDetail: '',
      preferredResolution: 'refund' as const,
      ...defaultValues,
    } as RefundRequestFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = refundRequestSchema.parse(value);
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

      <ControlledInput
        name="orderId"
        label="Order ID"
        placeholder="ORD-XXXXXX"
        required
        validators={{ onChange: refundRequestSchema.shape.orderId }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Items to Return</p>
        <form.Field name="items">
          {(field) => {
            const selected: string[] = (field.state.value as string[]) || [];
            return (
              <div className="flex flex-wrap gap-2">
                {availableItems.map((item) => {
                  const isSelected = selected.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        const next = isSelected ? selected.filter((x) => x !== item) : [...selected, item];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                        isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                      )}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Reason</p>
        <form.Field name="reason">
          {(field) => (
            <div className="grid grid-cols-2 gap-2">
              {REASON_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'rounded-md border px-3 py-2 text-xs font-medium transition-all',
                    field.state.value === value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state: any) => state.values.reason}>
        {(reason) =>
          reason === 'other' ? (
            <ControlledTextarea name="reasonDetail" label="Details" placeholder="Please explain the issue…" />
          ) : null
        }
      </form.Subscribe>

      <div className="space-y-2">
        <p className="text-sm font-medium">Preferred Resolution</p>
        <form.Field name="preferredResolution">
          {(field) => (
            <div className="flex gap-2">
              {RESOLUTION_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all',
                    field.state.value === value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <FormButton className="w-full">Submit Refund Request</FormButton>
    </Form>
  );
}
