'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { focusGroupSchema, type FocusGroupFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface FocusGroupFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: FocusGroupFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<FocusGroupFormData>;
}

const PARTICIPANT_TYPES = [
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'product_manager', label: 'Product Manager' },
  { value: 'entrepreneur', label: 'Entrepreneur' },
  { value: 'other', label: 'Other' },
] as const;

const AVAILABLE_SLOTS = [
  'Mon 2pm EST',
  'Tue 10am EST',
  'Wed 3pm EST',
  'Thu 11am EST',
] as const;

export function FocusGroupForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: FocusGroupFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      researchTopic: '',
      availableSlot: '',
      participantType: '',
      occupation: '',
      yearsExperience: '',
      compensationAccepted: false,
      ndaAccepted: false,
      ...defaultValues,
    } as FocusGroupFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = focusGroupSchema.parse(value);
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

      <ControlledInput
        name="researchTopic"
        label="Research Topic"
        required
        validators={{ onChange: focusGroupSchema.shape.researchTopic }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Available Time Slot <span className="text-destructive">*</span></p>
        <form.Field name="availableSlot">
          {(field) => (
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => field.handleChange(slot)}
                  className={cn(
                    'rounded-lg border px-3 py-2.5 text-sm font-medium transition-all text-left',
                    field.state.value === slot
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/40',
                  )}
                >
                  {slot}
                </button>
              ))}
              {field.state.meta.errors.length > 0 && (
                <p className="col-span-2 text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Participant Type <span className="text-destructive">*</span></p>
        <form.Field name="participantType">
          {(field) => (
            <div className="flex flex-wrap gap-2">
              {PARTICIPANT_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/40',
                  )}
                >
                  {label}
                </button>
              ))}
              {field.state.meta.errors.length > 0 && (
                <p className="w-full text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="occupation"
          label="Occupation"
          placeholder="e.g. Software Engineer"
        />
        <ControlledInput
          name="yearsExperience"
          label="Years of Experience"
          placeholder="e.g. 5"
        />
      </div>

      <div className="space-y-3 rounded-xl border border-border p-4">
        <ControlledCheckbox
          name="compensationAccepted"
          label="I accept the compensation terms for this focus group session"
          required
        />
        <ControlledCheckbox
          name="ndaAccepted"
          label="I agree to sign an NDA if required (optional)"
        />
      </div>

      <FormButton className="w-full">Apply for Focus Group</FormButton>
    </Form>
  );
}
