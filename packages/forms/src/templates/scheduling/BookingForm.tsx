'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { bookingSchema, type BookingFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormWizard } from '../../components/FormWizard';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface BookingFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: BookingFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<BookingFormData>;
  serviceTypes?: string[];
  availableSlots?: string[];
}

const DEFAULT_SERVICES = ['1:1 Mentorship', 'Code Review', 'Architecture Consult', 'Career Advice'];
const DEFAULT_SLOTS = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];

export function BookingForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  serviceTypes = DEFAULT_SERVICES,
  availableSlots = DEFAULT_SLOTS,
}: BookingFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      serviceType: '',
      preferredDate: '',
      preferredSlot: '',
      name: '',
      email: '',
      notes: '',
      ...defaultValues,
    } as BookingFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = bookingSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'service-slot',
      title: 'Service & Time',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <div className="space-y-2">
            <p className="text-sm font-medium">Service Type</p>
            <div className="grid grid-cols-2 gap-2">
              {serviceTypes.map((svc) => (
                <form.Field key={svc} name="serviceType">
                  {(field) => (
                    <button
                      type="button"
                      onClick={() => field.handleChange(svc)}
                      className={cn(
                        'rounded-lg border p-3 text-left text-sm font-medium transition-all',
                        field.state.value === svc
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-background hover:border-primary/40',
                      )}
                    >
                      {svc}
                    </button>
                  )}
                </form.Field>
              ))}
            </div>
          </div>
          <ControlledInput
            name="preferredDate"
            label="Preferred Date"
            type="date"
            required
            validators={{ onChange: bookingSchema.shape.preferredDate }}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Preferred Slot</p>
            <div className="flex flex-wrap gap-2">
              {availableSlots.map((slot) => (
                <form.Field key={slot} name="preferredSlot">
                  {(field) => (
                    <button
                      type="button"
                      onClick={() => field.handleChange(slot)}
                      className={cn(
                        'rounded-md border px-3 py-1.5 text-xs font-medium transition-all',
                        field.state.value === slot
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:border-primary/40',
                      )}
                    >
                      {slot}
                    </button>
                  )}
                </form.Field>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'contact',
      title: 'Contact',
      component: (
        <div className="space-y-4">
          <ControlledInput
            name="name"
            label="Your Name"
            placeholder="Aldrin Azucena"
            required
            validators={{ onChange: bookingSchema.shape.name }}
          />
          <ControlledInput
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            validators={{ onChange: bookingSchema.shape.email }}
          />
          <ControlledTextarea
            name="notes"
            label="Notes"
            placeholder="Anything you'd like me to know beforehand?"
          />
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
