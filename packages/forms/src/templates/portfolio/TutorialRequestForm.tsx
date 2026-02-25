'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { tutorialRequestSchema, type TutorialRequestFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface TutorialRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: TutorialRequestFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<TutorialRequestFormData>;
}

export function TutorialRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: TutorialRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      topic: '',
      format: 'written' as const,
      skillLevel: 'intermediate' as const,
      urgency: 'no rush' as const,
      additionalContext: '',
      ...defaultValues,
    } as TutorialRequestFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(tutorialRequestSchema.parse(value));
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
      <ControlledInput
        name="topic"
        label="Tutorial Topic"
        placeholder="Building a real-time dashboard with Next.js and ClickHouse"
        required
        validators={{ onChange: tutorialRequestSchema.shape.topic }}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium">Preferred Format</p>
        <form.Field name="format">
          {(field) => (
            <div className="grid grid-cols-4 gap-2">
              {(['video', 'written', 'interactive', 'all'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => field.handleChange(f)}
                  className={cn(
                    'rounded-md border px-2 py-2 text-xs font-medium capitalize transition-all',
                    field.state.value === f
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/50',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-sm font-medium">Skill Level</p>
          <form.Field name="skillLevel">
            {(field) => (
              <div className="flex flex-col gap-1">
                {(['beginner', 'intermediate', 'advanced'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => field.handleChange(s)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-all text-left',
                      field.state.value === s
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </form.Field>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">Urgency</p>
          <form.Field name="urgency">
            {(field) => (
              <div className="flex flex-col gap-1">
                {(['no rush', 'within a month', 'this week', 'asap'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => field.handleChange(u)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-all text-left',
                      field.state.value === u
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50',
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            )}
          </form.Field>
        </div>
      </div>
      <ControlledTextarea
        name="additionalContext"
        label="Additional Context (optional)"
        placeholder="Why this topic? What problem are you trying to solve?"
      />
      <FormButton className="w-full">Request Tutorial</FormButton>
    </Form>
  );
}
