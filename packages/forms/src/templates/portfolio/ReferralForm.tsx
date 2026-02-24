'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { referralSchema, type ReferralFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';
import { FormTypeEnum } from '@aazucena/api';

export interface ReferralFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ReferralFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ReferralFormData>;
}

export function ReferralForm({ variant = 'default', onSuccess, onError, className, defaultValues }: ReferralFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: { formType: FormTypeEnum.Values.Referral, name: '', email: '', subject: 'Client Referral', message: '', referralName: '', referralEmail: '', ...defaultValues } as ReferralFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(referralSchema.parse(value)); } catch (error) { onError?.(error); }
    },
  } as any);
  return (
    <Form form={form} variant={variant} className={cn('max-w-lg space-y-4', className)} onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <FormErrorSummary />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="name" label="Your Name" placeholder="Your name" required />
        <ControlledInput name="email" label="Your Email" type="email" placeholder="you@example.com" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="referralName" label="Referral Name" placeholder="Their name" required validators={{ onChange: referralSchema.shape.referralName }} />
        <ControlledInput name="referralEmail" label="Referral Email" type="email" placeholder="them@example.com" required validators={{ onChange: referralSchema.shape.referralEmail }} />
      </div>
      <ControlledTextarea name="message" label="Context" placeholder="How do you know them? What are they looking for?" required />
      <FormButton className="w-full">Submit Referral</FormButton>
    </Form>
  );
}
