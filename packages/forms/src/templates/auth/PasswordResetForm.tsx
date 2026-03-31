'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { passwordResetSchema, type PasswordResetFormData } from '../../schemas/index';
import { ControlledInput } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface PasswordResetFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: PasswordResetFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  token?: string;
  defaultValues?: Partial<PasswordResetFormData>;
}

export function PasswordResetForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  token = '',
  defaultValues,
}: PasswordResetFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
      ...defaultValues,
    } as PasswordResetFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = passwordResetSchema.parse(value);
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
        name="password"
        label="New Password"
        type="password"
        placeholder="••••••••"
        required
      />
      <ControlledInput
        name="confirmPassword"
        label="Confirm New Password"
        type="password"
        placeholder="••••••••"
        required
      />
      <FormButton className="w-full">Reset Password</FormButton>
    </Form>
  );
}
