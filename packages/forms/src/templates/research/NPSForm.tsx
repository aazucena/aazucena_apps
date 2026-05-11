'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { npsSchema, type NPSFormData } from '../../schemas/index';
import { ControlledTextarea, ControlledCheckbox, ControlledInput } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface NPSFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: NPSFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<NPSFormData>;
}

function getScoreColor(score: number): string {
  if (score >= 9) return 'border-green-500 bg-green-600 text-white';
  if (score >= 7) return 'border-yellow-500 bg-yellow-500 text-white';
  return 'border-red-500 bg-red-600 text-white';
}

function getScoreInactiveColor(score: number): string {
  if (score >= 9)
    return 'border-green-200 text-green-700 hover:border-green-400 dark:border-green-800 dark:text-green-400';
  if (score >= 7)
    return 'border-yellow-200 text-yellow-700 hover:border-yellow-400 dark:border-yellow-800 dark:text-yellow-400';
  return 'border-red-200 text-red-700 hover:border-red-400 dark:border-red-800 dark:text-red-400';
}

export function NPSForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: NPSFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      score: 7,
      promoterReason: '',
      detractorReason: '',
      improvementSuggestion: '',
      contactPermission: false,
      email: '',
      ...defaultValues,
    } as NPSFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(npsSchema.parse(value));
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
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      {/* Score picker */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          How likely are you to recommend us?{' '}
          <span className="text-muted-foreground font-normal">
            (0 = Not at all, 10 = Extremely likely)
          </span>
        </p>
        <form.Field name="score" validators={{ onChange: npsSchema.shape.score }}>
          {(field) => (
            <div className="flex gap-1">
              {Array.from({ length: 11 }, (_, i) => i).map((n) => {
                const isActive = field.state.value === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => field.handleChange(n)}
                    className={cn(
                      'flex-1 rounded-md border py-2 text-xs font-semibold transition-all',
                      isActive ? getScoreColor(n) : `bg-background ${getScoreInactiveColor(n)}`,
                    )}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          )}
        </form.Field>
        <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
          <span>Detractor</span>
          <span>Passive</span>
          <span>Promoter</span>
        </div>
      </div>

      {/* Conditional: promoter reason (score >= 9) */}
      <form.Subscribe selector={(state: any) => state.values.score}>
        {(score) =>
          score >= 9 ? (
            <ControlledTextarea
              name="promoterReason"
              label="What do you love most about us?"
              placeholder="Tell us what's working well…"
            />
          ) : null
        }
      </form.Subscribe>

      {/* Conditional: detractor reason (score <= 6) */}
      <form.Subscribe selector={(state: any) => state.values.score}>
        {(score) =>
          score <= 6 ? (
            <ControlledTextarea
              name="detractorReason"
              label="What's the main reason for your low score?"
              placeholder="Help us understand what went wrong…"
            />
          ) : null
        }
      </form.Subscribe>

      <ControlledTextarea
        name="improvementSuggestion"
        label="Any suggestions for improvement?"
        placeholder="What would make you more likely to recommend us?"
      />

      <ControlledCheckbox
        name="contactPermission"
        label="You may contact me to follow up on this feedback"
      />

      {/* Conditional: email when contactPermission is true */}
      <form.Subscribe selector={(state: any) => state.values.contactPermission}>
        {(allowed) =>
          allowed ? (
            <ControlledInput
              name="email"
              label="Your email address"
              type="email"
              placeholder="you@example.com"
            />
          ) : null
        }
      </form.Subscribe>

      <FormButton className="w-full">Submit Feedback</FormButton>
    </Form>
  );
}
