'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { testimonialFormSchema, type TestimonialFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';
import { FormTypeEnum } from '@aazucena/api';

export interface TestimonialFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: TestimonialFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<TestimonialFormData>;
}

export function TestimonialForm({ variant = 'default', onSuccess, onError, className, defaultValues }: TestimonialFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: { formType: FormTypeEnum.Values.Testimonial, name: '', email: '', subject: 'Testimonial', message: '', company: '', jobTitle: '', relationship: '', linkedinUrl: '', ...defaultValues } as TestimonialFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(testimonialFormSchema.parse(value)); } catch (error) { onError?.(error); }
    },
  } as any);
  return (
    <Form form={form} variant={variant} className={cn('max-w-lg space-y-4', className)} onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <FormErrorSummary />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="name" label="Name" placeholder="Jane Smith" required />
        <ControlledInput name="email" label="Email" type="email" placeholder="jane@company.com" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="company" label="Company" placeholder="Acme Corp" />
        <ControlledInput name="jobTitle" label="Job Title" placeholder="CTO" />
      </div>
      <ControlledInput name="linkedinUrl" label="LinkedIn URL" placeholder="https://linkedin.com/in/…" />
      <ControlledTextarea name="message" label="Testimonial" placeholder="Share your experience working with Aldrin…" required />
      <FormButton className="w-full">Submit Testimonial</FormButton>
    </Form>
  );
}
