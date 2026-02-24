'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { contactFormSchema, type ContactFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';
import { FormTypeEnum } from '@aazucena/api';

export interface ContactUsFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ContactFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ContactFormData>;
}

export function ContactUsForm({ variant = 'default', onSuccess, onError, className, defaultValues }: ContactUsFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: { formType: FormTypeEnum.Values.Contact, name: '', email: '', subject: '', message: '', ...defaultValues } as ContactFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(contactFormSchema.parse(value)); } catch (error) { onError?.(error); }
    },
  } as any);
  return (
    <Form form={form} variant={variant} className={cn('max-w-lg space-y-4', className)} onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <FormErrorSummary />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="name" label="Name" placeholder="Aldrin Azucena" required validators={{ onChange: contactFormSchema.shape.name }} />
        <ControlledInput name="email" label="Email" type="email" placeholder="you@example.com" required validators={{ onChange: contactFormSchema.shape.email }} />
      </div>
      <ControlledInput name="subject" label="Subject" placeholder="What's on your mind?" required validators={{ onChange: contactFormSchema.shape.subject }} />
      <ControlledTextarea name="message" label="Message" placeholder="Tell me more…" required validators={{ onChange: contactFormSchema.shape.message }} />
      <FormButton className="w-full">Send Message</FormButton>
    </Form>
  );
}
