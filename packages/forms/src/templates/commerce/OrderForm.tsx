'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { orderSchema, type OrderFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface OrderFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: OrderFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<OrderFormData>;
  itemsSummarySlot?: React.ReactNode;
  stripeSlot?: React.ReactNode;
}

export function OrderForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  itemsSummarySlot,
  stripeSlot,
}: OrderFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      orderNote: '',
      shippingName: '',
      shippingAddress: '',
      shippingCity: '',
      shippingPostalCode: '',
      shippingCountry: '',
      billingEmail: '',
      stripeToken: '',
      ...defaultValues,
    } as OrderFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = orderSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'items',
      title: 'Items',
      component: (
        <div className="space-y-4">
          {itemsSummarySlot ?? (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Order items — inject via <code>itemsSummarySlot</code> prop
            </div>
          )}
          <ControlledTextarea name="orderNote" label="Order Note" placeholder="Any special instructions?" />
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'Shipping',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput name="shippingName" label="Full Name" placeholder="Aldrin Azucena" required validators={{ onChange: orderSchema.shape.shippingName }} />
          <ControlledInput name="shippingAddress" label="Address" placeholder="123 Main St" required validators={{ onChange: orderSchema.shape.shippingAddress }} />
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput name="shippingCity" label="City" placeholder="San Francisco" required />
            <ControlledInput name="shippingPostalCode" label="Postal Code" placeholder="94105" required />
          </div>
          <ControlledInput name="shippingCountry" label="Country" placeholder="US" required />
        </div>
      ),
    },
    {
      id: 'payment',
      title: 'Payment',
      component: (
        <div className="space-y-4">
          <ControlledInput name="billingEmail" label="Billing Email" type="email" placeholder="you@example.com" required validators={{ onChange: orderSchema.shape.billingEmail }} />
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
