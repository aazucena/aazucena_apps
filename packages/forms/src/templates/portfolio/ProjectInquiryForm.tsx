'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { projectInquirySchema, type ProjectInquiryFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormWizard } from '../../components/FormWizard';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface ProjectInquiryFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ProjectInquiryFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ProjectInquiryFormData>;
}

export function ProjectInquiryForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ProjectInquiryFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      projectTitle: '',
      projectDescription: '',
      techRequirements: '',
      startDate: '',
      duration: '',
      budget: '',
      additionalNotes: '',
      ...defaultValues,
    } as ProjectInquiryFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(projectInquirySchema.parse(value));
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);
  const steps = [
    {
      id: 'scope',
      title: 'Scope',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput
              name="name"
              label="Name"
              placeholder="Jane Smith"
              required
              validators={{ onChange: projectInquirySchema.shape.name }}
            />
            <ControlledInput
              name="email"
              label="Email"
              type="email"
              placeholder="jane@company.com"
              required
              validators={{ onChange: projectInquirySchema.shape.email }}
            />
          </div>
          <ControlledInput name="company" label="Company" placeholder="Optional" />
          <ControlledInput
            name="projectTitle"
            label="Project Title"
            placeholder="Next-gen Portfolio Platform"
            required
            validators={{ onChange: projectInquirySchema.shape.projectTitle }}
          />
          <ControlledTextarea
            name="projectDescription"
            label="Description"
            placeholder="What are you building and why?"
            required
            validators={{ onChange: projectInquirySchema.shape.projectDescription }}
          />
          <ControlledTextarea
            name="techRequirements"
            label="Tech Requirements"
            placeholder="Preferred stack, constraints…"
          />
        </div>
      ),
    },
    {
      id: 'timeline',
      title: 'Timeline',
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput
              name="startDate"
              label="Start Date"
              placeholder="March 2026"
              required
              validators={{ onChange: projectInquirySchema.shape.startDate }}
            />
            <ControlledInput
              name="duration"
              label="Duration"
              placeholder="3 months"
              required
              validators={{ onChange: projectInquirySchema.shape.duration }}
            />
          </div>
          <ControlledInput
            name="budget"
            label="Budget Range"
            placeholder="$10k-$50k"
            required
            validators={{ onChange: projectInquirySchema.shape.budget }}
          />
          <ControlledTextarea
            name="additionalNotes"
            label="Additional Notes"
            placeholder="Anything else I should know?"
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
