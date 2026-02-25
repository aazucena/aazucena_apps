'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { consultationSchema, type ConsultationFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface ConsultationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ConsultationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ConsultationFormData>;
}

export function ConsultationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ConsultationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      goals: '',
      budget: '',
      preferredDate: '',
      howFound: '',
      ...defaultValues,
    } as ConsultationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = consultationSchema.parse(value);
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
          validators={{ onChange: consultationSchema.shape.name }}
        />
        <ControlledInput
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          validators={{ onChange: consultationSchema.shape.email }}
        />
      </div>
      <ControlledInput name="company" label="Company" placeholder="Optional" />
      <ControlledTextarea
        name="goals"
        label="Goals & Context"
        placeholder="What are you hoping to achieve?"
        required
        validators={{ onChange: consultationSchema.shape.goals }}
      />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="budget"
          label="Budget Range"
          placeholder="$500-$2k"
          required
          validators={{ onChange: consultationSchema.shape.budget }}
        />
        <ControlledInput
          name="preferredDate"
          label="Preferred Date/Time"
          placeholder="Tues or Thurs, 2-4 PM PST"
          required
          validators={{ onChange: consultationSchema.shape.preferredDate }}
        />
      </div>
      <ControlledInput
        name="howFound"
        label="How did you find me?"
        placeholder="Twitter, GitHub, referral…"
      />
      <FormButton className="w-full">Request Consultation</FormButton>
    </Form>
  );
}
