'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { collaborationSchema, type CollaborationFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';
import { FormTypeEnum } from '@aazucena/api';

export interface CollaborationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: CollaborationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<CollaborationFormData>;
}

export function CollaborationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: CollaborationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      formType: FormTypeEnum.Values.Collaboration,
      name: '',
      email: '',
      subject: '',
      message: '',
      projectType: '',
      budget: '',
      timeline: '',
      ...defaultValues,
    } as CollaborationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(collaborationSchema.parse(value));
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
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="name" label="Name" placeholder="Jane Smith" required />
        <ControlledInput
          name="email"
          label="Email"
          type="email"
          placeholder="jane@example.com"
          required
        />
      </div>
      <ControlledInput
        name="subject"
        label="Collaboration Type"
        placeholder="Speaking, Writing, Partnership…"
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="budget" label="Budget" placeholder="Optional" />
        <ControlledInput name="timeline" label="Timeline" placeholder="e.g. Q2 2026" />
      </div>
      <ControlledTextarea
        name="message"
        label="Details"
        placeholder="Tell me about the opportunity…"
        required
      />
      <FormButton className="w-full">Propose Collaboration</FormButton>
    </Form>
  );
}
