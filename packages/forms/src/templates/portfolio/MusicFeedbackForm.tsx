'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { musicFeedbackSchema, type MusicFeedbackFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';
import { FormTypeEnum } from '@aazucena/api';

export interface MusicFeedbackFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: MusicFeedbackFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<MusicFeedbackFormData>;
  trackTitle?: string;
  feedbackElements?: string[];
}

const DEFAULT_ELEMENTS = ['Mix', 'Arrangement', 'Melody', 'Sound Design', 'Lyrics', 'Energy'];

export function MusicFeedbackForm({ variant = 'default', onSuccess, onError, className, defaultValues, trackTitle, feedbackElements = DEFAULT_ELEMENTS }: MusicFeedbackFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: { formType: FormTypeEnum.Values['Music Feedback'], name: '', email: '', subject: trackTitle ? `Feedback: ${trackTitle}` : '', message: '', trackTitle: trackTitle ?? '', elements: [] as string[], ...defaultValues } as MusicFeedbackFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(musicFeedbackSchema.parse(value)); } catch (error) { onError?.(error); }
    },
  } as any);
  return (
    <Form form={form} variant={variant} className={cn('max-w-lg space-y-4', className)} onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <FormErrorSummary />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="name" label="Name" placeholder="Aldrin Azucena" required />
        <ControlledInput name="email" label="Email" type="email" placeholder="you@example.com" required />
      </div>
      <ControlledInput name="trackTitle" label="Track Title" placeholder="Which track are you reviewing?" />
      <div className="space-y-2">
        <p className="text-sm font-medium">Elements to Comment On</p>
        <div className="flex flex-wrap gap-2">
          {feedbackElements.map((el) => (
            <form.Field key={el} name="elements">
              {(field) => {
                const isSelected = ((field.state.value as string[]) ?? []).includes(el);
                return (
                  <button type="button" onClick={() => { const cur = (field.state.value as string[]) ?? []; field.handleChange(isSelected ? cur.filter((e) => e !== el) : [...cur, el]); }}
                    className={cn('rounded-full border px-3 py-1 text-xs font-medium transition-all', isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:border-primary/50')}>
                    {el}
                  </button>
                );
              }}
            </form.Field>
          ))}
        </div>
      </div>
      <ControlledTextarea name="message" label="Your Feedback" placeholder="Share your thoughts on the track…" required />
      <FormButton className="w-full">Submit Feedback</FormButton>
    </Form>
  );
}
