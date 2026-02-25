'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { quizSchema, type QuizFormData, type QuizQuestion } from '../../schemas/index.js';
import { FormWizard } from '../../components/FormWizard.js';

export interface QuizFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: QuizFormData & { score: number; total: number }) => void;
  onError?: (error: unknown) => void;
  className?: string;
  questions: QuizQuestion[];
  defaultValues?: Partial<QuizFormData>;
}

export function QuizForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  questions,
  defaultValues,
}: QuizFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      participantName: '',
      participantEmail: '',
      answers: {},
      ...defaultValues,
    } as QuizFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = quizSchema.parse(value);
        const score = questions.reduce((acc, q) => {
          return acc + (validated.answers[q.id] === q.correctIndex ? q.points : 0);
        }, 0);
        const total = questions.reduce((acc, q) => acc + q.points, 0);
        onSuccess?.({ ...validated, score, total });
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = questions.map((q, idx) => ({
    id: q.id,
    title: `Q${idx + 1}`,
    component: (
      <div className="space-y-4">
        <p className="text-base font-semibold">{q.question}</p>
        <div className="space-y-2">
          {q.options.map((opt, optIdx) => (
            <form.Field key={opt} name={`answers.${q.id}`}>
              {(field) => (
                <button
                  type="button"
                  onClick={() => field.handleChange(optIdx)}
                  className={cn(
                    'w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all',
                    field.state.value === optIdx
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/40',
                  )}
                >
                  <span className="mr-2 font-mono text-xs opacity-50">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  {opt}
                </button>
              )}
            </form.Field>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {q.points} pt{q.points !== 1 ? 's' : ''}
        </p>
      </div>
    ),
  }));

  return (
    <Form
      form={form}
      variant={variant}
      className={cn('max-w-lg', className)}
      onSubmit={(e) => e.preventDefault()}
    >
      <FormWizard
        steps={steps}
        onComplete={async () => {
          await form.handleSubmit();
        }}
        showChallenge={false}
      />
    </Form>
  );
}
