'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { subscriptionChangeSchema, type SubscriptionChangeFormData } from '../../schemas/index.js';
import { ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface SubscriptionChangeFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: SubscriptionChangeFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<SubscriptionChangeFormData>;
}

const PLAN_OPTIONS = [
  { value: 'starter', label: 'Starter', description: 'For individuals' },
  { value: 'pro', label: 'Pro', description: 'For small teams' },
  { value: 'team', label: 'Team', description: 'For growing teams' },
  { value: 'enterprise', label: 'Enterprise', description: 'Custom features & SLA' },
] as const;

export function SubscriptionChangeForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: SubscriptionChangeFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      newPlan: 'pro' as const,
      billingCycle: 'monthly' as const,
      effectiveDate: 'next_cycle' as const,
      cancellationFeedback: '',
      ...defaultValues,
    } as SubscriptionChangeFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = subscriptionChangeSchema.parse(value);
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
      className={cn('max-w-md space-y-5', className)}
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
    >
      <FormErrorSummary />

      <div className="space-y-2">
        <p className="text-sm font-medium">New Plan</p>
        <form.Field name="newPlan">
          {(field) => (
            <div className="grid grid-cols-2 gap-2">
              {PLAN_OPTIONS.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-all',
                    field.state.value === value ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className={cn('text-sm font-bold', field.state.value === value && 'text-primary')}>{label}</span>
                  <span className="text-[11px] text-muted-foreground">{description}</span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Billing Cycle</p>
        <form.Field name="billingCycle">
          {(field) => (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => field.handleChange('monthly')}
                className={cn(
                  'flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all',
                  field.state.value === 'monthly' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                )}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => field.handleChange('annual')}
                className={cn(
                  'flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all',
                  field.state.value === 'annual' ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                )}
              >
                Annual <span className="text-green-500 font-bold">Save 20%</span>
              </button>
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Effective Date</p>
        <form.Field name="effectiveDate">
          {(field) => (
            <div className="flex gap-2">
              {([
                { value: 'immediate', label: 'Immediately' },
                { value: 'next_cycle', label: 'Next Billing Cycle' },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-all',
                    field.state.value === value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledTextarea
        name="cancellationFeedback"
        label="Feedback"
        placeholder="What could we do better?"
        description="Optional — help us improve"
      />

      <FormButton className="w-full">Confirm Change</FormButton>
    </Form>
  );
}
