'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { profileSchema, type ProfileFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface ProfileFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ProfileFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ProfileFormData>;
}

export function ProfileForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ProfileFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      displayName: '',
      avatarUrl: '',
      bio: '',
      location: '',
      website: '',
      socialLinks: { github: '', linkedin: '', twitter: '' },
      timezone: 'UTC',
      preferredTheme: 'system' as const,
      ...defaultValues,
    } as ProfileFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(profileSchema.parse(value));
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
        name="displayName"
        label="Display Name"
        placeholder="Aldrin Azucena"
        required
        validators={{ onChange: profileSchema.shape.displayName }}
      />
      <ControlledInput
        name="avatarUrl"
        label="Avatar URL"
        placeholder="https://example.com/avatar.png"
        type="url"
      />
      <ControlledTextarea name="bio" label="Bio" placeholder="A short bio about yourself…" />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="location" label="Location" placeholder="Manila, PH" />
        <ControlledInput
          name="timezone"
          label="Timezone"
          placeholder="UTC"
          required
          validators={{ onChange: profileSchema.shape.timezone }}
        />
      </div>
      <ControlledInput
        name="website"
        label="Website"
        placeholder="https://yoursite.com"
        type="url"
      />
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Social Links</p>
        <div className="grid grid-cols-3 gap-3">
          <ControlledInput name="socialLinks.github" label="GitHub" placeholder="your-handle" />
          <ControlledInput name="socialLinks.twitter" label="Twitter / X" placeholder="@handle" />
          <ControlledInput
            name="socialLinks.linkedin"
            label="LinkedIn URL"
            placeholder="https://linkedin.com/in/…"
            type="url"
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Preferred Theme</p>
        <form.Field name="preferredTheme">
          {(field) => (
            <div className="flex gap-3">
              {(['light', 'dark', 'system'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => field.handleChange(t)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-medium capitalize transition-all',
                    field.state.value === t
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/50',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>
      <FormButton className="w-full">Save Profile</FormButton>
    </Form>
  );
}
