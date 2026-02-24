'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { hireInquirySchema, type HireInquiryFormData } from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface HireInquiryFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: HireInquiryFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<HireInquiryFormData>;
}

export function HireInquiryForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: HireInquiryFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      company: '',
      contactName: '',
      email: '',
      roleType: 'Contract' as const,
      roleTitle: '',
      compensationRange: '',
      workMode: 'Remote' as const,
      startDate: '',
      ...defaultValues,
    } as HireInquiryFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = hireInquirySchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  return (
    <Form form={form} variant={variant} className={cn('max-w-lg space-y-4', className)} onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <FormErrorSummary />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="company" label="Company" placeholder="Acme Corp" required validators={{ onChange: hireInquirySchema.shape.company }} />
        <ControlledInput name="contactName" label="Your Name" placeholder="Jane Smith" required validators={{ onChange: hireInquirySchema.shape.contactName }} />
      </div>
      <ControlledInput name="email" label="Email" type="email" placeholder="jane@acme.com" required validators={{ onChange: hireInquirySchema.shape.email }} />
      <ControlledInput name="roleTitle" label="Role Title" placeholder="Senior Full-Stack Engineer" required validators={{ onChange: hireInquirySchema.shape.roleTitle }} />
      <ControlledInput name="compensationRange" label="Compensation Range" placeholder="$150k-$180k or $120/hr" required validators={{ onChange: hireInquirySchema.shape.compensationRange }} />
      <ControlledInput name="startDate" label="Expected Start Date" placeholder="March 2026 or ASAP" required validators={{ onChange: hireInquirySchema.shape.startDate }} />
      <FormButton className="w-full">Send Inquiry</FormButton>
    </Form>
  );
}
