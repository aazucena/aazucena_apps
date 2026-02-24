'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { surveySchema, type SurveyFormData, type SurveyQuestion } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';

export interface SurveyFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: SurveyFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<SurveyFormData>;
  questions: SurveyQuestion[];
  title?: string;
}

export function SurveyForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  questions,
  title = 'Survey',
}: SurveyFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      respondentName: '',
      respondentEmail: '',
      answers: {},
      openFeedback: '',
      ...defaultValues,
    } as SurveyFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = surveySchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const questionSteps = questions.map((q) => ({
    id: q.id,
    title: `Q${questions.indexOf(q) + 1}`,
    component: (
      <div className="space-y-4">
        <p className="text-base font-semibold">{q.question}</p>
        {q.type === 'text' || q.type === 'textarea' ? (
          <form.Field name={`answers.${q.id}`}>
            {(field) => (
              <textarea
                className={cn(
                  'w-full rounded-xl border border-border bg-background p-3 text-sm resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30',
                )}
                placeholder="Your answer…"
                value={(field.state.value as string) ?? ''}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
        ) : q.type === 'rating' ? (
          <form.Field name={`answers.${q.id}`}>
            {(field) => (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
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
                ))}
              </div>
            )}
          </form.Field>
        ) : (
          <form.Field name={`answers.${q.id}`}>
            {(field) => (
              <div className="space-y-2">
                {q.options?.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      if (q.type === 'checkbox') {
                        const current = (field.state.value as string[]) ?? [];
                        field.handleChange(
                          current.includes(opt) ? current.filter((o) => o !== opt) : [...current, opt],
                        );
                      } else {
                        field.handleChange(opt);
                      }
                    }}
                    className={cn(
                      'w-full rounded-lg border px-4 py-2.5 text-left text-sm font-medium transition-all',
                      (q.type === 'checkbox'
                        ? ((field.state.value as string[]) ?? []).includes(opt)
                        : field.state.value === opt)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background hover:border-primary/40',
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </form.Field>
        )}
      </div>
    ),
  }));

  const steps = [
    ...questionSteps,
    {
      id: 'wrap-up',
      title: 'Finish',
      component: (
        <div className="space-y-4">
          <ControlledInput name="respondentName" label="Your Name" placeholder="Optional" />
          <ControlledInput name="respondentEmail" label="Email" type="email" placeholder="Optional" />
          <ControlledTextarea name="openFeedback" label="Any other feedback?" placeholder="Optional open-ended thoughts…" />
        </div>
      ),
    },
  ];

  return (
    <Form form={form} variant={variant} className={cn('max-w-lg', className)} onSubmit={(e) => e.preventDefault()}>
      <FormWizard steps={steps} onComplete={async () => { await form.handleSubmit(); }} showChallenge={false} />
    </Form>
  );
}
