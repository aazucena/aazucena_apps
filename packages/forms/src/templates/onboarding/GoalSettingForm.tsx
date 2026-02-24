'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { goalSettingSchema, type GoalSettingFormData } from '../../schemas/index.js';
import { ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface GoalSettingFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: GoalSettingFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<GoalSettingFormData>;
}

const PRIMARY_GOAL_OPTIONS = [
  { value: 'ship_faster', label: 'Ship Faster', icon: '🚀' },
  { value: 'reduce_bugs', label: 'Reduce Bugs', icon: '🐛' },
  { value: 'improve_dx', label: 'Improve DX', icon: '⚡' },
  { value: 'grow_team', label: 'Grow Team', icon: '👥' },
  { value: 'save_costs', label: 'Save Costs', icon: '💰' },
] as const;

const TIMELINE_OPTIONS = [
  { value: '30d', label: '30 Days' },
  { value: '90d', label: '90 Days' },
  { value: '6mo', label: '6 Months' },
  { value: '1yr', label: '1 Year' },
] as const;

const REMINDER_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
] as const;

export function GoalSettingForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: GoalSettingFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      primaryGoal: 'ship_faster' as const,
      timeline: '90d' as const,
      successMetric: '',
      reminderFrequency: 'weekly' as const,
      ...defaultValues,
    } as GoalSettingFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = goalSettingSchema.parse(value);
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
      className={cn('max-w-lg space-y-6', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Primary Goal</p>
        <p className="text-xs text-muted-foreground">What is the most important thing you want to achieve?</p>
        <form.Field name="primaryGoal">
          {(field) => (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {PRIMARY_GOAL_OPTIONS.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex flex-col items-center rounded-md border px-3 py-3 text-center transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="text-xl">{icon}</span>
                  <span
                    className={cn(
                      'mt-1 text-xs font-semibold',
                      field.state.value === value && 'text-primary'
                    )}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Timeline</p>
        <form.Field name="timeline">
          {(field) => (
            <div className="flex gap-2">
              {TIMELINE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-2 py-2 text-xs font-medium transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
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
        name="successMetric"
        label="Success Metric"
        placeholder="e.g. Reduce deployment time from 2 hours to 15 minutes"
        description="How will you know when you've achieved this goal?"
        required
        validators={{ onChange: goalSettingSchema.shape.successMetric }}
      />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Reminder Frequency</p>
        <p className="text-xs text-muted-foreground">How often should we check in on your progress?</p>
        <form.Field name="reminderFrequency">
          {(field) => (
            <div className="flex gap-2">
              {REMINDER_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-2 py-2 text-xs font-medium transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <FormButton className="w-full">Set Goals</FormButton>
    </Form>
  );
}
