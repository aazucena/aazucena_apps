'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { loginSchema, type LoginFormData } from '../../schemas/index';
import { ControlledInput, ControlledCheckbox } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface LoginFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: LoginFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<LoginFormData>;
}

export function LoginForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: LoginFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
      ...defaultValues,
    } as LoginFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = loginSchema.parse(value);
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
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        validators={{ onChange: loginSchema.shape.email }}
      />
      <ControlledInput
        name="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        required
        validators={{ onChange: loginSchema.shape.password }}
      />
      <ControlledCheckbox name="rememberMe" label="Remember me" />
      <FormButton className="w-full">Sign In</FormButton>
    </Form>
  );
}
