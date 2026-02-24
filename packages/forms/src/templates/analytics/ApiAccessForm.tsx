'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { apiAccessSchema, type ApiAccessFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface ApiAccessFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ApiAccessFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ApiAccessFormData>;
}

export function ApiAccessForm({ variant = 'default', onSuccess, onError, className, defaultValues }: ApiAccessFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: { name: '', email: '', organization: '', useCase: '', intendedUsage: 'Personal' as const, expectedVolume: '< 1k req/day' as const, agreedToTerms: false, ...defaultValues } as ApiAccessFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(apiAccessSchema.parse(value)); } catch (error) { onError?.(error); }
    },
  } as any);
  const steps = [
    {
      id: 'identity',
      title: 'Identity',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput name="name" label="Name" placeholder="Aldrin Azucena" required validators={{ onChange: apiAccessSchema.shape.name }} />
          <ControlledInput name="email" label="Email" type="email" placeholder="you@example.com" required validators={{ onChange: apiAccessSchema.shape.email }} />
          <ControlledInput name="organization" label="Organization" placeholder="Optional" />
        </div>
      ),
    },
    {
      id: 'use-case',
      title: 'Use Case',
      component: (
        <div className="space-y-4">
          <ControlledTextarea name="useCase" label="Use Case" placeholder="Describe how you plan to use the API…" required validators={{ onChange: apiAccessSchema.shape.useCase }} />
          <ControlledCheckbox name="agreedToTerms" label="I agree to the API Terms of Service" />
        </div>
      ),
    },
  ];
  return (
    <Form form={form} variant={variant} className={cn('max-w-lg', className)} onSubmit={(e) => e.preventDefault()}>
      <FormWizard steps={steps} onComplete={async () => { await form.handleSubmit(); }} showChallenge={true} />
    </Form>
  );
}
