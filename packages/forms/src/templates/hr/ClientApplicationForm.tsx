'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { clientApplicationSchema, type ClientApplicationFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormWizard } from '../../components/FormWizard';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface ClientApplicationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ClientApplicationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ClientApplicationFormData>;
}

export function ClientApplicationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ClientApplicationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      companyName: '',
      projectTitle: '',
      contactName: '',
      email: '',
      website: '',
      techStack: '',
      teamSize: '2-5' as const,
      teamCulture: '',
      budget: '',
      whyAldrin: '',
      ...defaultValues,
    } as ClientApplicationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = clientApplicationSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'screening',
      title: 'Screening',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput
            name="companyName"
            label="Company Name"
            placeholder="Acme Corp"
            required
            validators={{ onChange: clientApplicationSchema.shape.companyName }}
          />
          <ControlledInput
            name="projectTitle"
            label="Project Title"
            placeholder="Next-gen SaaS Platform"
            required
            validators={{ onChange: clientApplicationSchema.shape.projectTitle }}
          />
          <ControlledInput
            name="contactName"
            label="Your Name"
            placeholder="Jane Smith"
            required
            validators={{ onChange: clientApplicationSchema.shape.contactName }}
          />
          <ControlledInput
            name="email"
            label="Email"
            type="email"
            placeholder="jane@acme.com"
            required
            validators={{ onChange: clientApplicationSchema.shape.email }}
          />
          <ControlledInput name="website" label="Company Website" placeholder="https://acme.com" />
        </div>
      ),
    },
    {
      id: 'requirements',
      title: 'Requirements',
      component: (
        <div className="space-y-4">
          <ControlledTextarea
            name="techStack"
            label="Tech Stack"
            placeholder="TypeScript, React, Node.js, PostgreSQL…"
            required
            validators={{ onChange: clientApplicationSchema.shape.techStack }}
          />
          <ControlledInput
            name="budget"
            label="Budget Range"
            placeholder="$10k-$50k"
            required
            validators={{ onChange: clientApplicationSchema.shape.budget }}
          />
          <ControlledTextarea
            name="teamCulture"
            label="Team Culture"
            placeholder="Describe how your team works…"
            required
            validators={{ onChange: clientApplicationSchema.shape.teamCulture }}
          />
          <ControlledTextarea
            name="whyAldrin"
            label="Why Aldrin?"
            placeholder="Why do you want to work with Aldrin specifically?"
            required
            validators={{ onChange: clientApplicationSchema.shape.whyAldrin }}
          />
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
        showChallenge={true}
      />
    </Form>
  );
}
