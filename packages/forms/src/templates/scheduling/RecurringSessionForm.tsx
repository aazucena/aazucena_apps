'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { recurringSessionSchema, type RecurringSessionFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface RecurringSessionFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: RecurringSessionFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<RecurringSessionFormData>;
}

const SESSION_TYPE_OPTIONS = [
  { value: 'standup', label: 'Standup' },
  { value: 'one_on_one', label: '1:1' },
  { value: 'team_sync', label: 'Team Sync' },
  { value: 'retrospective', label: 'Retro' },
  { value: 'workshop', label: 'Workshop' },
] as const;

const RECURRENCE_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
] as const;

export function RecurringSessionForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: RecurringSessionFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      sessionType: 'standup' as const,
      startDate: '',
      time: '',
      recurrence: 'weekly' as const,
      occurrences: undefined,
      endDate: '',
      participants: '',
      notes: '',
      ...defaultValues,
    } as RecurringSessionFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = recurringSessionSchema.parse(value);
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

      <div className="space-y-2">
        <p className="text-sm font-medium">Session Type</p>
        <form.Field name="sessionType">
          {(field) => (
            <div className="flex flex-wrap gap-2">
              {SESSION_TYPE_OPTIONS.map(({ value, label }) => (
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

      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="startDate"
          label="Start Date"
          type="date"
          required
          validators={{ onChange: recurringSessionSchema.shape.startDate }}
        />
        <ControlledInput
          name="time"
          label="Time"
          type="time"
          required
          validators={{ onChange: recurringSessionSchema.shape.time }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Recurrence</p>
        <form.Field name="recurrence">
          {(field) => (
            <div className="flex gap-2">
              {RECURRENCE_OPTIONS.map(({ value, label }) => (
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

      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="occurrences"
          label="Number of Occurrences"
          type="number"
          min="1"
          max="52"
          placeholder="Leave blank for ongoing"
          description="Optional"
        />
        <ControlledInput
          name="endDate"
          label="End Date"
          type="date"
          description="Optional alternative to occurrences"
        />
      </div>

      <ControlledTextarea
        name="participants"
        label="Participants"
        placeholder={'alice@example.com\nbob@example.com'}
        description="One email or name per line"
        required
        validators={{ onChange: recurringSessionSchema.shape.participants }}
      />

      <ControlledTextarea
        name="notes"
        label="Notes"
        placeholder="Any recurring agenda items or notes…"
      />

      <FormButton className="w-full">Schedule Sessions</FormButton>
    </Form>
  );
}
