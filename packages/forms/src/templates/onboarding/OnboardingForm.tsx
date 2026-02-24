'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { onboardingSchema, type OnboardingFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledSwitch } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface OnboardingFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: OnboardingFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<OnboardingFormData>;
}

export function OnboardingForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: OnboardingFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      displayName: '',
      bio: '',
      avatarUrl: '',
      theme: 'system' as const,
      notifications: true,
      newsletter: false,
      githubHandle: '',
      linkedinUrl: '',
      websiteUrl: '',
      ...defaultValues,
    } as OnboardingFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = onboardingSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'profile',
      title: 'Profile',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput
            name="displayName"
            label="Display Name"
            placeholder="Aldrin Azucena"
            required
            validators={{ onChange: onboardingSchema.shape.displayName }}
          />
          <ControlledTextarea
            name="bio"
            label="Short Bio"
            placeholder="Engineer, musician, builder…"
            description="Max 500 characters. Shown on your public profile."
          />
          <ControlledInput
            name="avatarUrl"
            label="Avatar URL"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
      ),
    },
    {
      id: 'preferences',
      title: 'Preferences',
      component: (
        <div className="space-y-4">
          <ControlledSwitch name="notifications" label="Enable Notifications" />
          <ControlledSwitch name="newsletter" label="Subscribe to Newsletter" />
        </div>
      ),
    },
    {
      id: 'integrations',
      title: 'Integrations',
      component: (
        <div className="space-y-4">
          <ControlledInput
            name="githubHandle"
            label="GitHub Handle"
            placeholder="aazucena"
            description="Without the @ symbol."
          />
          <ControlledInput
            name="linkedinUrl"
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/..."
          />
          <ControlledInput
            name="websiteUrl"
            label="Personal Website"
            placeholder="https://aldrinazucena.com"
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
        showChallenge={false}
      />
    </Form>
  );
}
