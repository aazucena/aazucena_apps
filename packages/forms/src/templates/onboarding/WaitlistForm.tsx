'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { waitlistSchema, type WaitlistFormData } from '../../schemas/index';
import { ControlledInput } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface WaitlistFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: WaitlistFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<WaitlistFormData>;
}

export function WaitlistForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: WaitlistFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
      email: '',
      referralCode: '',
      ...defaultValues,
    } as WaitlistFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = waitlistSchema.parse(value);
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
        validators={{ onChange: waitlistSchema.shape.name }}
      />
      <ControlledInput
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        validators={{ onChange: waitlistSchema.shape.email }}
      />
      <ControlledInput
        name="referralCode"
        label="Referral Code"
        placeholder="Optional"
        description="Have a friend's referral code? Enter it here."
      />
      <FormButton className="w-full">Join Waitlist</FormButton>
    </Form>
  );
}
