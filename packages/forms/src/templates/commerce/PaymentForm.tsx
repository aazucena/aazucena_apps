'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { paymentSchema, type PaymentFormData } from '../../schemas/index';
import { ControlledInput } from '../fields';
import { FormWizard } from '../../components/FormWizard';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface PaymentFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: PaymentFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<PaymentFormData>;
  stripeSlot?: React.ReactNode;
}

export function PaymentForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  stripeSlot,
}: PaymentFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      billingName: '',
      billingEmail: '',
      billingAddress: '',
      billingCity: '',
      billingPostalCode: '',
      billingCountry: '',
      stripeToken: '',
      ...defaultValues,
    } as PaymentFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = paymentSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'billing',
      title: 'Billing',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput
            name="billingName"
            label="Full Name"
            placeholder="Aldrin Azucena"
            required
            validators={{ onChange: paymentSchema.shape.billingName }}
          />
          <ControlledInput
            name="billingEmail"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            validators={{ onChange: paymentSchema.shape.billingEmail }}
          />
          <ControlledInput
            name="billingAddress"
            label="Address"
            placeholder="123 Main St"
            required
            validators={{ onChange: paymentSchema.shape.billingAddress }}
          />
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput name="billingCity" label="City" placeholder="San Francisco" required />
            <ControlledInput
              name="billingPostalCode"
              label="Postal Code"
              placeholder="94105"
              required
            />
          </div>
          <ControlledInput name="billingCountry" label="Country" placeholder="US" required />
        </div>
      ),
    },
    {
      id: 'payment',
      title: 'Payment',
      component: (
        <div className="space-y-4">
          {stripeSlot ?? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Stripe Elements slot — inject via <code>stripeSlot</code> prop
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Form
      form={form}
      variant={variant}
      className={cn('max-w-lg', className)}
      onSubmit={(e) => e.preventDefault()}
    >
      <FormWizard
        steps={steps}
        onComplete={async () => {
          await form.handleSubmit();
        }}
        showChallenge={false}
      />
    </Form>
  );
}
