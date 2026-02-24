'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { docsFeedbackSchema, type DocsFeedbackFormData } from '../../schemas/index.js';
import { ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface DocsFeedbackFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: DocsFeedbackFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<DocsFeedbackFormData>;
  /** Current page URL — auto-filled but can be overridden */
  pageUrl?: string;
}

const CATEGORIES = [
  { value: 'unclear', label: 'Unclear' },
  { value: 'incomplete', label: 'Incomplete' },
  { value: 'outdated', label: 'Outdated' },
  { value: 'typo', label: 'Typo / Error' },
  { value: 'other', label: 'Other' },
] as const;

export function DocsFeedbackForm({ variant = 'default', onSuccess, onError, className, defaultValues, pageUrl = '' }: DocsFeedbackFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      helpful: undefined as any,
      pageUrl,
      category: 'other' as const,
      comment: '',
      ...defaultValues,
    } as DocsFeedbackFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(docsFeedbackSchema.parse(value)); } catch (error) { onError?.(error); }
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
        <p className="text-sm font-medium">Was this page helpful?</p>
        <form.Field name="helpful">
          {(field) => (
            <div className="flex gap-3">
              {(['yes', 'no'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => field.handleChange(v)}
                  className={cn(
                    'flex-1 rounded-md border px-4 py-2 text-sm font-medium capitalize transition-all',
                    field.state.value === v ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/50'
                  )}
                >
                  {v === 'yes' ? '👍 Yes' : '👎 No'}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">What was the issue?</p>
        <form.Field name="category">
          {(field) => (
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                    field.state.value === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>
      <ControlledTextarea name="comment" label="Additional comments (optional)" placeholder="Tell us more about what could be improved…" />
      <FormButton className="w-full">Send Feedback</FormButton>
    </Form>
  );
}
