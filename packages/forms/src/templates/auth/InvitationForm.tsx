'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { invitationSchema, type InvitationFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface InvitationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: InvitationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<InvitationFormData>;
}

const ROLE_OPTIONS = [
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
  { value: 'editor', label: 'Editor', description: 'Can create and edit content' },
  { value: 'admin', label: 'Admin', description: 'Full management access' },
  { value: 'owner', label: 'Owner', description: 'Full ownership & billing' },
] as const;

const EXPIRY_OPTIONS = [
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
  { value: 'never', label: 'Never' },
] as const;

export function InvitationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: InvitationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      email: '',
      role: 'viewer' as const,
      personalMessage: '',
      expiresInDays: '7' as const,
      sendCopy: false,
      ...defaultValues,
    } as InvitationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = invitationSchema.parse(value);
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
      className={cn('max-w-md space-y-4', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />
      <ControlledInput
        name="email"
        label="Email Address"
        type="email"
        placeholder="colleague@company.com"
        required
        validators={{ onChange: invitationSchema.shape.email }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Role</p>
        <form.Field name="role">
          {(field) => (
            <div className="grid grid-cols-2 gap-2">
              {ROLE_OPTIONS.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex flex-col items-start rounded-md border px-3 py-2 text-left transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className={cn('text-xs font-bold', field.state.value === value && 'text-primary')}>
                    {label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{description}</span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledTextarea
        name="personalMessage"
        label="Personal Message"
        placeholder="Hey, I'd like to invite you to collaborate on…"
        description="Optional — included in the invitation email"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Invitation Expires</p>
        <form.Field name="expiresInDays">
          {(field) => (
            <div className="flex gap-2">
              {EXPIRY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledCheckbox name="sendCopy" label="Send me a copy of this invitation" />
      <FormButton className="w-full">Send Invitation</FormButton>
    </Form>
  );
}
