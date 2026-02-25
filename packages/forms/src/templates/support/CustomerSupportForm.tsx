'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { customerSupportSchema, type CustomerSupportFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface CustomerSupportFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: CustomerSupportFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<CustomerSupportFormData>;
}

export function CustomerSupportForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: CustomerSupportFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
      email: '',
      category: 'Other' as const,
      priority: 'Medium' as const,
      subject: '',
      description: '',
      ...defaultValues,
    } as CustomerSupportFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = customerSupportSchema.parse(value);
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
      className={cn('max-w-lg space-y-4', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="name"
          label="Your Name"
          placeholder="Aldrin Azucena"
          required
          validators={{ onChange: customerSupportSchema.shape.name }}
        />
        <ControlledInput
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          validators={{ onChange: customerSupportSchema.shape.email }}
        />
      </div>
      <ControlledInput
        name="subject"
        label="Subject"
        placeholder="Brief summary of your issue"
        required
        validators={{ onChange: customerSupportSchema.shape.subject }}
      />
      <ControlledTextarea
        name="description"
        label="Description"
        placeholder="Please describe your issue in detail…"
        required
        validators={{ onChange: customerSupportSchema.shape.description }}
      />
      <FormButton className="w-full">Submit Ticket</FormButton>
    </Form>
  );
}
