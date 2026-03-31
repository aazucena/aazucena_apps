'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { feedbackFormSchema, type FeedbackFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';
import { FormTypeEnum } from '@aazucena/api';

export interface FeedbackFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: FeedbackFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<FeedbackFormData>;
}

export function FeedbackForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: FeedbackFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      formType: FormTypeEnum.Values.Feedback,
      name: '',
      email: '',
      subject: '',
      message: '',
      rating: undefined,
      category: 'General' as const,
      ...defaultValues,
    } as FeedbackFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(feedbackFormSchema.parse(value));
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);
  return (
    <Form
      form={form}
      variant={variant}
      className={cn('max-w-lg space-y-4', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />
      <div className="space-y-2">
        <p className="text-sm font-medium">Rating</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <form.Field key={n} name="rating">
              {(field) => (
                <button
                  type="button"
                  onClick={() => field.handleChange(n)}
                  className={cn(
                    'h-10 w-10 rounded-full border text-sm font-bold transition-all',
                    field.state.value === n
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/40',
                  )}
                >
                  {n}
                </button>
              )}
            </form.Field>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="name" label="Name" placeholder="Aldrin Azucena" required />
        <ControlledInput
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <ControlledInput
        name="subject"
        label="Subject"
        placeholder="What's the feedback about?"
        required
      />
      <ControlledTextarea name="message" label="Feedback" placeholder="Your thoughts…" required />
      <FormButton className="w-full">Submit Feedback</FormButton>
    </Form>
  );
}
