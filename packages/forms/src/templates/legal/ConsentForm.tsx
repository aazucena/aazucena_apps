'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { consentSchema, type ConsentFormData } from '../../schemas/index';
import { ControlledSwitch } from '../fields';
import { FormButton } from '../../components/FormButton';

export interface ConsentFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ConsentFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ConsentFormData>;
}

export function ConsentForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ConsentFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      analyticsConsent: false,
      marketingConsent: false,
      functionalConsent: true,
      timestamp: new Date().toISOString(),
      ...defaultValues,
    } as ConsentFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = consentSchema.parse({ ...value, timestamp: new Date().toISOString() });
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
      className={cn('max-w-md space-y-6', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="space-y-4 rounded-xl border border-border p-4">
        <ControlledSwitch
          name="functionalConsent"
          label="Functional Cookies"
          description="Required for core site functionality. Cannot be disabled."
          disabled
        />
        <ControlledSwitch
          name="analyticsConsent"
          label="Analytics Cookies"
          description="Help us understand how you use the site to improve it."
        />
        <ControlledSwitch
          name="marketingConsent"
          label="Marketing Cookies"
          description="Allow us to show you relevant content and offers."
        />
      </div>
      <FormButton className="w-full">Save Preferences</FormButton>
    </Form>
  );
}
