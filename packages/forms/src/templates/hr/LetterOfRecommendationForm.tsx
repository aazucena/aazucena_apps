'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import {
  letterOfRecommendationSchema,
  type LetterOfRecommendationFormData,
} from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface LetterOfRecommendationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: LetterOfRecommendationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<LetterOfRecommendationFormData>;
}

export function LetterOfRecommendationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: LetterOfRecommendationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      requesterName: '',
      email: '',
      relationship: 'Colleague' as const,
      context: '',
      desiredTone: 'Professional' as const,
      deadline: '',
      platform: 'LinkedIn' as const,
      ...defaultValues,
    } as LetterOfRecommendationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = letterOfRecommendationSchema.parse(value);
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
      className={cn('max-w-lg space-y-4', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />
      <ControlledInput
        name="requesterName"
        label="Your Name"
        placeholder="Aldrin Azucena"
        required
        validators={{ onChange: letterOfRecommendationSchema.shape.requesterName }}
      />
      <ControlledInput
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        validators={{ onChange: letterOfRecommendationSchema.shape.email }}
      />
      <ControlledInput
        name="deadline"
        label="Deadline"
        placeholder="March 15, 2026"
        required
        validators={{ onChange: letterOfRecommendationSchema.shape.deadline }}
      />
      <ControlledTextarea
        name="context"
        label="Context & Relationship"
        placeholder="Describe how you know each other and what the recommendation is for…"
        required
        validators={{ onChange: letterOfRecommendationSchema.shape.context }}
      />
      <FormButton className="w-full">Submit Request</FormButton>
    </Form>
  );
}
