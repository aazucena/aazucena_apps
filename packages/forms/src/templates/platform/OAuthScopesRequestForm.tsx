'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { oauthScopesSchema, type OAuthScopesFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface OAuthScopesRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: OAuthScopesFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<OAuthScopesFormData>;
}

const SCOPE_OPTIONS = [
  { value: 'read', label: 'Read', description: 'Read public data' },
  { value: 'write', label: 'Write', description: 'Create and update resources' },
  { value: 'admin', label: 'Admin', description: 'Manage settings and users' },
  { value: 'webhooks', label: 'Webhooks', description: 'Subscribe to events' },
] as const;

export function OAuthScopesRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: OAuthScopesRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      appName: '',
      appUrl: '',
      redirectUris: '',
      requestedScopes: [] as Array<'read' | 'write' | 'admin' | 'webhooks'>,
      useCase: '',
      company: '',
      contactEmail: '',
      ...defaultValues,
    } as OAuthScopesFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(oauthScopesSchema.parse(value));
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
          name="appName"
          label="App Name"
          placeholder="My Integration"
          required
          validators={{ onChange: oauthScopesSchema.shape.appName }}
        />
        <ControlledInput
          name="appUrl"
          label="App URL"
          placeholder="https://myapp.com"
          type="url"
          required
          validators={{ onChange: oauthScopesSchema.shape.appUrl }}
        />
      </div>
      <ControlledTextarea
        name="redirectUris"
        label="Redirect URIs"
        placeholder="https://myapp.com/callback&#10;https://myapp.com/oauth/callback"
        required
        validators={{ onChange: oauthScopesSchema.shape.redirectUris }}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium">Requested Scopes</p>
        <form.Field name="requestedScopes">
          {(field) => {
            const selected = (field.state.value as string[]) ?? [];
            return (
              <div className="grid grid-cols-2 gap-2">
                {SCOPE_OPTIONS.map(({ value, label, description }) => {
                  const isActive = selected.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        field.handleChange(
                          isActive ? selected.filter((s) => s !== value) : [...selected, value],
                        );
                      }}
                      className={cn(
                        'flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left transition-all',
                        isActive
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      <span className={cn('text-xs font-semibold', isActive && 'text-primary')}>
                        {label}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{description}</span>
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>
      <ControlledTextarea
        name="useCase"
        label="Use Case"
        placeholder="Describe what your app does and why it needs these permissions…"
        required
        validators={{ onChange: oauthScopesSchema.shape.useCase }}
      />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="company" label="Company (optional)" placeholder="Acme Corp" />
        <ControlledInput
          name="contactEmail"
          label="Contact Email"
          type="email"
          placeholder="dev@myapp.com"
          required
          validators={{ onChange: oauthScopesSchema.shape.contactEmail }}
        />
      </div>
      <FormButton className="w-full">Submit OAuth Request</FormButton>
    </Form>
  );
}
