'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { demoRequestSchema, type DemoRequestFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface DemoRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: DemoRequestFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<DemoRequestFormData>;
}

export function DemoRequestForm({ variant = 'default', onSuccess, onError, className, defaultValues }: DemoRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: { name: '', email: '', company: '', useCase: '', teamSize: 'Solo' as const, currentTools: '', ...defaultValues } as DemoRequestFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(demoRequestSchema.parse(value)); } catch (error) { onError?.(error); }
    },
  } as any);
  return (
    <Form form={form} variant={variant} className={cn('max-w-lg space-y-4', className)} onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <FormErrorSummary />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="name" label="Name" placeholder="Aldrin Azucena" required validators={{ onChange: demoRequestSchema.shape.name }} />
        <ControlledInput name="email" label="Email" type="email" placeholder="you@example.com" required validators={{ onChange: demoRequestSchema.shape.email }} />
      </div>
      <ControlledInput name="company" label="Company" placeholder="Optional" />
      <ControlledTextarea name="useCase" label="Use Case" placeholder="What will you use AZUCENA_LYTICS for?" required validators={{ onChange: demoRequestSchema.shape.useCase }} />
      <ControlledInput name="currentTools" label="Current Tools" placeholder="What analytics tools do you use now?" />
      <FormButton className="w-full">Request Demo Access</FormButton>
    </Form>
  );
}
