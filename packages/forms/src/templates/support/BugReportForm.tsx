'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { bugReportSchema, type BugReportFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';
import { FormTypeEnum } from '@aazucena/api';

export interface BugReportFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: BugReportFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<BugReportFormData>;
}

export function BugReportForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: BugReportFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      formType: FormTypeEnum.Values['Bug Report'],
      name: '',
      email: '',
      subject: '',
      message: '',
      severity: 'Medium' as const,
      browser: '',
      os: '',
      url: '',
      ...defaultValues,
    } as BugReportFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = bugReportSchema.parse(value);
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
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="name"
          label="Your Name"
          placeholder="Aldrin Azucena"
          required
          validators={{ onChange: bugReportSchema.shape.name }}
        />
        <ControlledInput
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          validators={{ onChange: bugReportSchema.shape.email }}
        />
      </div>
      <ControlledInput
        name="subject"
        label="Subject"
        placeholder="Brief summary of the bug"
        required
        validators={{ onChange: bugReportSchema.shape.subject }}
      />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="browser" label="Browser" placeholder="Chrome 120" />
        <ControlledInput name="os" label="Operating System" placeholder="macOS 15" />
      </div>
      <ControlledInput name="url" label="Page URL" placeholder="https://…" />
      <ControlledTextarea
        name="message"
        label="Steps to Reproduce"
        placeholder="1. Go to…&#10;2. Click on…&#10;3. See error"
        required
        validators={{ onChange: bugReportSchema.shape.message }}
      />
      <FormButton className="w-full">Report Bug</FormButton>
    </Form>
  );
}
