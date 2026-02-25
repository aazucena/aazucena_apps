'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { availabilitySetupSchema, type AvailabilitySetupFormData } from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface AvailabilitySetupFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: AvailabilitySetupFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<AvailabilitySetupFormData>;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const BUFFER_OPTIONS = [
  { value: '0', label: 'None' },
  { value: '5', label: '5 min' },
  { value: '10', label: '10 min' },
  { value: '15', label: '15 min' },
  { value: '30', label: '30 min' },
] as const;

export function AvailabilitySetupForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: AvailabilitySetupFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      timezone: 'UTC',
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: '09:00',
      endTime: '17:00',
      bufferBetween: '15' as const,
      advanceNotice: 24,
      maxPerDay: 5,
      ...defaultValues,
    } as AvailabilitySetupFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = availabilitySetupSchema.parse(value);
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
        name="timezone"
        label="Timezone"
        placeholder="UTC"
        description="e.g. America/New_York, Asia/Manila"
        required
        validators={{ onChange: availabilitySetupSchema.shape.timezone }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Available Days</p>
        <form.Field name="weekdays">
          {(field) => {
            const selected: string[] = (field.state.value as string[]) || [];
            return (
              <div className="flex gap-1.5">
                {DAYS.map((day) => {
                  const isSelected = selected.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const next = isSelected
                          ? selected.filter((d) => d !== day)
                          : [...selected, day];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'flex-1 rounded-md border py-2 text-[11px] font-medium transition-all',
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="startTime"
          label="Start Time"
          type="time"
          required
          validators={{ onChange: availabilitySetupSchema.shape.startTime }}
        />
        <ControlledInput
          name="endTime"
          label="End Time"
          type="time"
          required
          validators={{ onChange: availabilitySetupSchema.shape.endTime }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Buffer Between Bookings</p>
        <form.Field name="bufferBetween">
          {(field) => (
            <div className="flex gap-1.5">
              {BUFFER_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border py-1.5 text-[11px] font-medium transition-all',
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
          name="advanceNotice"
          label="Advance Notice (hours)"
          type="number"
          min="0"
          max="72"
          validators={{ onChange: availabilitySetupSchema.shape.advanceNotice }}
        />
        <ControlledInput
          name="maxPerDay"
          label="Max Bookings / Day"
          type="number"
          min="1"
          max="20"
          validators={{ onChange: availabilitySetupSchema.shape.maxPerDay }}
        />
      </div>

      <FormButton className="w-full">Save Availability</FormButton>
    </Form>
  );
}
