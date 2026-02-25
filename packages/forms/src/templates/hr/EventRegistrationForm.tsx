'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { eventRegistrationSchema, type EventRegistrationFormData } from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface EventRegistrationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: EventRegistrationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<EventRegistrationFormData>;
}

export function EventRegistrationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: EventRegistrationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
      email: '',
      ticketType: 'General' as const,
      dietaryRequirements: '',
      emergencyContact: '',
      organization: '',
      ...defaultValues,
    } as EventRegistrationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = eventRegistrationSchema.parse(value);
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
        validators={{ onChange: eventRegistrationSchema.shape.name }}
      />
      <ControlledInput
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        validators={{ onChange: eventRegistrationSchema.shape.email }}
      />
      <ControlledInput name="organization" label="Organization" placeholder="Optional" />
      <ControlledInput
        name="dietaryRequirements"
        label="Dietary Requirements"
        placeholder="Vegetarian, Gluten-free, etc."
      />
      <ControlledInput
        name="emergencyContact"
        label="Emergency Contact"
        placeholder="Name and phone number"
      />
      <FormButton className="w-full">Register</FormButton>
    </Form>
  );
}
