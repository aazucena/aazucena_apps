'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { privacySettingsSchema, type PrivacySettingsFormData } from '../../schemas/index.js';
import { ControlledSwitch } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface PrivacySettingsFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: PrivacySettingsFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<PrivacySettingsFormData>;
}

const VISIBILITY_OPTIONS = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can view your profile',
  },
  {
    value: 'connections',
    label: 'Connections',
    description: 'Only people you follow',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can see your profile',
  },
] as const;

export function PrivacySettingsForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: PrivacySettingsFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      profileVisibility: 'public' as const,
      analyticsConsent: false,
      personalizedAds: false,
      dataSharingPartners: false,
      activityStatus: true,
      ...defaultValues,
    } as PrivacySettingsFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = privacySettingsSchema.parse(value);
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
      <FormErrorSummary />

      <div className="space-y-2">
        <p className="text-sm font-semibold">Profile Visibility</p>
        <p className="text-xs text-muted-foreground">Control who can discover and view your profile</p>
        <form.Field name="profileVisibility">
          {(field) => (
            <div className="grid grid-cols-3 gap-2">
              {VISIBILITY_OPTIONS.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex flex-col items-start rounded-md border px-3 py-2.5 text-left transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span
                    className={cn(
                      'text-xs font-bold',
                      field.state.value === value && 'text-primary'
                    )}
                  >
                    {label}
                  </span>
                  <span className="mt-0.5 text-[11px] text-muted-foreground">{description}</span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Data &amp; Tracking</p>
        <div className="space-y-3 rounded-md border border-border p-4">
          <ControlledSwitch
            name="analyticsConsent"
            label="Analytics &amp; Usage Data"
            description="Help improve the product by sharing anonymous usage analytics"
            validators={{ onChange: privacySettingsSchema.shape.analyticsConsent }}
          />
          <ControlledSwitch
            name="personalizedAds"
            label="Personalized Ads"
            description="Allow targeted advertising based on your interests"
            validators={{ onChange: privacySettingsSchema.shape.personalizedAds }}
          />
          <ControlledSwitch
            name="dataSharingPartners"
            label="Share Data with Partners"
            description="Allow trusted third-party partners to access your anonymized data"
            validators={{ onChange: privacySettingsSchema.shape.dataSharingPartners }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Presence</p>
        <div className="rounded-md border border-border p-4">
          <ControlledSwitch
            name="activityStatus"
            label="Show Activity Status"
            description="Let others see when you were last active"
            validators={{ onChange: privacySettingsSchema.shape.activityStatus }}
          />
        </div>
      </div>

      <FormButton className="w-full">Save Privacy Settings</FormButton>
    </Form>
  );
}
