'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { reschedulingSchema, type ReschedulingFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea, ControlledCheckbox } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface ReschedulingFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ReschedulingFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ReschedulingFormData>;
}

const REASON_OPTIONS = [
  { value: 'conflict', label: 'Schedule Conflict' },
  { value: 'illness', label: 'Illness' },
  { value: 'travel', label: 'Travel' },
  { value: 'work', label: 'Work Obligation' },
  { value: 'personal', label: 'Personal Matter' },
  { value: 'other', label: 'Other' },
] as const;

export function ReschedulingForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ReschedulingFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      appointmentId: '',
      newDate: '',
      newTimeSlot: '',
      reason: 'conflict' as const,
      notifyParticipants: true,
      additionalNote: '',
      ...defaultValues,
    } as ReschedulingFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(reschedulingSchema.parse(value));
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
        name="appointmentId"
        label="Appointment ID"
        placeholder="APT-2026-001"
        required
        validators={{ onChange: reschedulingSchema.shape.appointmentId }}
      />

      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="newDate"
          label="New Date"
          type="date"
          required
          validators={{ onChange: reschedulingSchema.shape.newDate }}
        />
        <ControlledInput
          name="newTimeSlot"
          label="New Time Slot"
          placeholder="e.g. 2:00 PM – 3:00 PM"
          required
          validators={{ onChange: reschedulingSchema.shape.newTimeSlot }}
        />
      </div>

      {/* Reason — radio buttons */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Reason for rescheduling <span className="text-destructive">*</span>
        </p>
        <form.Field name="reason" validators={{ onChange: reschedulingSchema.shape.reason }}>
          {(field) => (
            <div className="grid grid-cols-2 gap-2">
              {REASON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.handleChange(opt.value)}
                  className={cn(
                    'rounded-md border px-3 py-2 text-left text-sm font-medium transition-all',
                    field.state.value === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/40',
                  )}
                >
                  {opt.label}
                </button>
              ))}
              {field.state.meta.errors.length > 0 && (
                <p className="col-span-2 text-xs text-destructive">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledCheckbox
        name="notifyParticipants"
        label="Notify all participants about the rescheduling"
      />

      <ControlledTextarea
        name="additionalNote"
        label="Additional note (optional)"
        placeholder="Any context you'd like to share with participants…"
      />

      <FormButton className="w-full">Confirm Reschedule</FormButton>
    </Form>
  );
}
