'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { prRequestSchema, type PrRequestFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface PrRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: PrRequestFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<PrRequestFormData>;
}

export function PrRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: PrRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      repository: '',
      title: '',
      branch: '',
      description: '',
      relatedIssues: '',
      hasTests: false,
      hasDocs: false,
      isBreaking: false,
      ...defaultValues,
    } as PrRequestFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = prRequestSchema.parse(value);
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
        name="repository"
        label="Repository"
        placeholder="owner/repo-name"
        required
        validators={{ onChange: prRequestSchema.shape.repository }}
      />
      <ControlledInput
        name="title"
        label="PR Title"
        placeholder="feat: add dark mode support"
        required
        validators={{ onChange: prRequestSchema.shape.title }}
      />
      <ControlledInput
        name="branch"
        label="Branch Name"
        placeholder="feature/dark-mode"
        required
        validators={{ onChange: prRequestSchema.shape.branch }}
      />
      <ControlledInput name="relatedIssues" label="Related Issues" placeholder="#42, #55" />
      <ControlledTextarea
        name="description"
        label="Description"
        placeholder="Describe what this PR does and why…"
        required
        validators={{ onChange: prRequestSchema.shape.description }}
      />
      <div className="space-y-2 rounded-xl border border-border p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Checklist
        </p>
        <ControlledCheckbox name="hasTests" label="Tests included" />
        <ControlledCheckbox name="hasDocs" label="Documentation updated" />
        <ControlledCheckbox name="isBreaking" label="Breaking change" />
      </div>
      <FormButton className="w-full">Submit PR</FormButton>
    </Form>
  );
}
