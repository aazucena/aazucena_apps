'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { securityQuestionsSchema, type SecurityQuestionsFormData } from '../../schemas/index';
import { ControlledInput } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface SecurityQuestionsFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: SecurityQuestionsFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<SecurityQuestionsFormData>;
}

const PRESET_QUESTIONS = [
  'What was the name of your first pet?',
  'What city were you born in?',
  "What is your mother's maiden name?",
  'What was the name of your elementary school?',
  'What was the make of your first car?',
  "What is your oldest sibling's middle name?",
  'What street did you grow up on?',
  'What was the name of your childhood best friend?',
];

function QuestionSelect({
  index,
  fieldName,
  selectedValues,
  form,
}: {
  index: number;
  fieldName: string;
  selectedValues: string[];
  form: any;
}) {
  return (
    <form.Field name={fieldName}>
      {(field: any) => (
        <div className="space-y-1">
          <label className="text-sm font-medium">Security Question {index}</label>
          <select
            value={field.state.value || ''}
            onChange={(e) => field.handleChange(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Select a question…</option>
            {PRESET_QUESTIONS.map((q) => (
              <option
                key={q}
                value={q}
                disabled={selectedValues.includes(q) && field.state.value !== q}
              >
                {q}
              </option>
            ))}
          </select>
          {field.state.meta.errors?.length > 0 && (
            <p className="text-xs text-destructive">{field.state.meta.errors[0]}</p>
          )}
        </div>
      )}
    </form.Field>
  );
}

export function SecurityQuestionsForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: SecurityQuestionsFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      question1: '',
      answer1: '',
      question2: '',
      answer2: '',
      question3: '',
      answer3: '',
      ...defaultValues,
    } as SecurityQuestionsFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = securityQuestionsSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const [q1, q2, q3] = [
    form.getFieldValue('question1') as string,
    form.getFieldValue('question2') as string,
    form.getFieldValue('question3') as string,
  ];

  return (
    <Form
      form={form}
      variant={variant}
      className={cn('max-w-md space-y-5', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      {([1, 2, 3] as const).map((i) => (
        <div key={i} className="space-y-2 rounded-md border border-border p-3">
          <QuestionSelect
            index={i}
            fieldName={`question${i}`}
            selectedValues={[q1, q2, q3].filter(Boolean)}
            form={form}
          />
          <ControlledInput
            name={`answer${i}`}
            label={`Answer ${i}`}
            type="password"
            placeholder="Your answer (case-insensitive)"
            required
            validators={{ onChange: securityQuestionsSchema.shape[`answer${i}` as 'answer1'] }}
          />
        </div>
      ))}

      <p className="text-[11px] text-muted-foreground">
        Answers are stored hashed and never displayed in plain text.
      </p>
      <FormButton className="w-full">Save Security Questions</FormButton>
    </Form>
  );
}
