'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { featureRequestSchema, type FeatureRequestFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';
import { FormTypeEnum } from '@aazucena/api';

export interface FeatureRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: FeatureRequestFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<FeatureRequestFormData>;
}

export function FeatureRequestForm({ variant = 'default', onSuccess, onError, className, defaultValues }: FeatureRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: { formType: FormTypeEnum.Values['Feature Request'], name: '', email: '', subject: '', message: '', impact: 'Useful' as const, ...defaultValues } as FeatureRequestFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(featureRequestSchema.parse(value)); } catch (error) { onError?.(error); }
    },
  } as any);
  return (
    <Form form={form} variant={variant} className={cn('max-w-lg space-y-4', className)} onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <FormErrorSummary />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="name" label="Name" placeholder="Aldrin Azucena" required />
        <ControlledInput name="email" label="Email" type="email" placeholder="you@example.com" required />
      </div>
      <ControlledInput name="subject" label="Feature Title" placeholder="One-line summary of the feature" required />
      <ControlledTextarea name="message" label="Description" placeholder="Describe the feature and why it would be valuable…" required />
      <FormButton className="w-full">Submit Request</FormButton>
    </Form>
  );
}
