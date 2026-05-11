'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { contributionsSchema, type ContributionsFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormWizard } from '../../components/FormWizard';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface ContributionsFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ContributionsFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ContributionsFormData>;
}

export function ContributionsForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ContributionsFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
      email: '',
      githubHandle: '',
      contributionType: 'Code' as const,
      repository: '',
      scope: '',
      notes: '',
      ...defaultValues,
    } as ContributionsFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = contributionsSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'contributor',
      title: 'You',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput
            name="name"
            label="Your Name"
            placeholder="Aldrin Azucena"
            required
            validators={{ onChange: contributionsSchema.shape.name }}
          />
          <ControlledInput
            name="email"
            label="Email"
            type="email"
            placeholder="you@example.com"
            required
            validators={{ onChange: contributionsSchema.shape.email }}
          />
          <ControlledInput
            name="githubHandle"
            label="GitHub Handle"
            placeholder="aazucena"
            required
            validators={{ onChange: contributionsSchema.shape.githubHandle }}
          />
        </div>
      ),
    },
    {
      id: 'contribution',
      title: 'Contribution',
      component: (
        <div className="space-y-4">
          <ControlledInput
            name="repository"
            label="Repository"
            placeholder="owner/repo-name"
            required
            validators={{ onChange: contributionsSchema.shape.repository }}
          />
          <ControlledTextarea
            name="scope"
            label="Scope"
            placeholder="Describe what you contributed…"
            required
            validators={{ onChange: contributionsSchema.shape.scope }}
          />
          <ControlledTextarea name="notes" label="Notes" placeholder="Any additional context…" />
        </div>
      ),
    },
  ];

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
