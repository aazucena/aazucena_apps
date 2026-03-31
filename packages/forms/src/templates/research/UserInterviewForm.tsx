'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { userInterviewSchema, type UserInterviewFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormWizard } from '../../components/FormWizard';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface UserInterviewFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: UserInterviewFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<UserInterviewFormData>;
}

const TENURE_OPTIONS = [
  { value: '<1_month', label: '< 1 Month' },
  { value: '1-6_months', label: '1–6 Months' },
  { value: '6-12_months', label: '6–12 Months' },
  { value: '1-2_years', label: '1–2 Years' },
  { value: '2+_years', label: '2+ Years' },
] as const;

const FORMAT_OPTIONS = [
  { value: 'video', label: 'Video Call' },
  { value: 'phone', label: 'Phone' },
  { value: 'async_written', label: 'Async Written' },
] as const;

export function UserInterviewForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: UserInterviewFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      role: '',
      company: '',
      howLongUsing: '1-6_months' as const,
      primaryGoals: '',
      painPoints: '',
      sessionFormat: 'video' as const,
      schedulingWindow: '',
      ...defaultValues,
    } as UserInterviewFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = userInterviewSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'background',
      title: 'Background',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput
              name="role"
              label="Your Role"
              placeholder="e.g. Senior Engineer"
              required
              validators={{ onChange: userInterviewSchema.shape.role }}
            />
            <ControlledInput name="company" label="Company" placeholder="Acme Corp (optional)" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">How long have you been using this product?</p>
            <form.Field name="howLongUsing">
              {(field) => (
                <div className="flex flex-wrap gap-2">
                  {TENURE_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.handleChange(value)}
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                        field.state.value === value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      ),
    },
    {
      id: 'preferences',
      title: 'Session Preferences',
      component: (
        <div className="space-y-4">
          <ControlledTextarea
            name="primaryGoals"
            label="Primary Goals"
            placeholder="What are you trying to achieve with this product?"
            required
            validators={{ onChange: userInterviewSchema.shape.primaryGoals }}
          />
          <ControlledTextarea
            name="painPoints"
            label="Pain Points"
            placeholder="What challenges or frustrations have you encountered?"
            required
            validators={{ onChange: userInterviewSchema.shape.painPoints }}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Session Format</p>
            <form.Field name="sessionFormat">
              {(field) => (
                <div className="flex gap-2">
                  {FORMAT_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.handleChange(value)}
                      className={cn(
                        'flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all',
                        field.state.value === value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </form.Field>
          </div>
          <ControlledInput
            name="schedulingWindow"
            label="Scheduling Window"
            placeholder="e.g. Weekdays 2–5 PM EST"
            required
            validators={{ onChange: userInterviewSchema.shape.schedulingWindow }}
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
