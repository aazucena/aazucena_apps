'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { abTestEnrollmentSchema, type ABTestEnrollmentFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface ABTestEnrollmentFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ABTestEnrollmentFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ABTestEnrollmentFormData>;
}

const VARIANT_OPTIONS = [
  { value: 'control', label: 'Control', description: 'Current experience' },
  { value: 'variant_a', label: 'Variant A', description: 'Experimental version A' },
  { value: 'variant_b', label: 'Variant B', description: 'Experimental version B' },
  { value: 'no_preference', label: 'No Preference', description: 'Assign me randomly' },
] as const;

export function ABTestEnrollmentForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ABTestEnrollmentFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      experimentId: '',
      consentToVariant: false,
      variantPreference: 'no_preference' as const,
      dataCollectionConsent: false,
      exitSurveyOptIn: false,
      ...defaultValues,
    } as ABTestEnrollmentFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = abTestEnrollmentSchema.parse(value);
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
      className={cn('max-w-md space-y-5', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      <ControlledInput
        name="experimentId"
        label="Experiment ID"
        placeholder="exp_homepage_v2"
        required
        validators={{ onChange: abTestEnrollmentSchema.shape.experimentId }}
        description="The identifier of the experiment you are enrolling in"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Variant Preference</p>
        <form.Field name="variantPreference">
          {(field) => (
            <div className="grid grid-cols-2 gap-2">
              {VARIANT_OPTIONS.map(({ value: v, label, description }) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => field.handleChange(v)}
                  className={cn(
                    'flex flex-col items-start rounded-lg border p-3 text-left transition-all',
                    field.state.value === v
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  <span
                    className={cn('text-xs font-bold', field.state.value === v && 'text-primary')}
                  >
                    {label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{description}</span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledCheckbox
        name="consentToVariant"
        label="I consent to participate in this experiment"
        required
      />
      <ControlledCheckbox
        name="dataCollectionConsent"
        label="I consent to anonymous usage data being collected during the experiment"
      />
      <ControlledCheckbox
        name="exitSurveyOptIn"
        label="I'm willing to complete a short exit survey when the experiment ends"
      />

      <FormButton className="w-full">Enroll in Experiment</FormButton>
    </Form>
  );
}
