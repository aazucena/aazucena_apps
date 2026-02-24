'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { passwordRequestSchema, type PasswordRequestFormData } from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface PasswordRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: PasswordRequestFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<PasswordRequestFormData>;
}

export function PasswordRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: PasswordRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      email: '',
      ...defaultValues,
    } as PasswordRequestFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = passwordRequestSchema.parse(value);
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
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        required
        description="We'll send a reset link to this address."
        validators={{ onChange: passwordRequestSchema.shape.email }}
      />
      <FormButton className="w-full">Send Reset Link</FormButton>
    </Form>
  );
}
