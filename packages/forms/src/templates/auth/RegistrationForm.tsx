'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { registrationSchema, type RegistrationFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface RegistrationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: RegistrationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<RegistrationFormData>;
}

export function RegistrationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: RegistrationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      ...defaultValues,
    } as RegistrationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = registrationSchema.parse(value);
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
        name="name"
        label="Full Name"
        placeholder="Aldrin Azucena"
        required
        
      />
      <ControlledInput
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        
      />
      <ControlledInput
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required
        
      />
      <ControlledInput
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        placeholder="••••••••"
        required
        
      />
      <ControlledCheckbox
        name="acceptTerms"
        label="I accept the Terms of Service and Privacy Policy"
      />
      <FormButton className="w-full">Create Account</FormButton>
    </Form>
  );
}
