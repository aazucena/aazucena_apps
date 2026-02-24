'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { guestbookSchema, type GuestbookFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface GuestbookFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: GuestbookFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<GuestbookFormData>;
}

const MOOD_OPTIONS = ['😄', '🚀', '💡', '🎵', '🔥', '✨', '👾', '🤝'];

export function GuestbookForm({ variant = 'default', onSuccess, onError, className, defaultValues }: GuestbookFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
      message: '',
      website: '',
      mood: '',
      publicConsent: false,
      ...defaultValues,
    } as GuestbookFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(guestbookSchema.parse(value)); } catch (error) { onError?.(error); }
    },
  } as any);

  return (
    <Form
      form={form}
      variant={variant}
      className={cn('max-w-lg space-y-4', className)}
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
    >
      <FormErrorSummary />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="name" label="Name" placeholder="Aldrin Azucena" required validators={{ onChange: guestbookSchema.shape.name }} />
        <ControlledInput name="website" label="Website (optional)" placeholder="https://yoursite.com" type="url" />
      </div>
      <ControlledTextarea name="message" label="Leave a message" placeholder="Love the work! Inspired by the animations…" required validators={{ onChange: guestbookSchema.shape.message }} />
      <div className="space-y-2">
        <p className="text-sm font-medium">Your Mood (optional)</p>
        <form.Field name="mood">
          {(field) => (
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => field.handleChange(field.state.value === emoji ? '' : emoji)}
                  className={cn(
                    'rounded-lg border px-3 py-2 text-lg transition-all',
                    field.state.value === emoji ? 'border-primary bg-primary/10 scale-110' : 'border-border hover:border-primary/50'
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>
      <ControlledCheckbox name="publicConsent" label="I consent to my message being displayed publicly" required validators={{ onChange: guestbookSchema.shape.publicConsent }} />
      <FormButton className="w-full">Sign Guestbook</FormButton>
    </Form>
  );
}
