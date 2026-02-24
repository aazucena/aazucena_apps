'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { ssoSchema, type SSOFormData } from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface SSOFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: SSOFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<SSOFormData>;
}

const PROVIDER_OPTIONS = [
  { value: 'google', label: 'Google', emoji: '🔵' },
  { value: 'github', label: 'GitHub', emoji: '⚫' },
  { value: 'microsoft', label: 'Microsoft', emoji: '🟦' },
  { value: 'okta', label: 'Okta', emoji: '🔷' },
  { value: 'auth0', label: 'Auth0', emoji: '🟠' },
  { value: 'saml', label: 'SAML', emoji: '🔒' },
  { value: 'oidc', label: 'OIDC', emoji: '🌐' },
] as const;

const ENTERPRISE_PROVIDERS = new Set(['saml', 'oidc', 'okta']);

export function SSOForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: SSOFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      provider: 'google' as const,
      tenantDomain: '',
      ssoEmail: '',
      ...defaultValues,
    } as SSOFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = ssoSchema.parse(value);
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
      className={cn('max-w-sm space-y-5', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      <div className="space-y-2">
        <p className="text-sm font-medium">Sign in with</p>
        <form.Field name="provider">
          {(field) => (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {PROVIDER_OPTIONS.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-md border px-2 py-2.5 transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="text-lg">{emoji}</span>
                  <span
                    className={cn(
                      'text-[11px] font-medium',
                      field.state.value === value ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(state: any) => state.values.provider}>
        {(provider) =>
          ENTERPRISE_PROVIDERS.has(provider as string) ? (
            <ControlledInput
              name="tenantDomain"
              label="Tenant / Domain"
              placeholder="yourcompany.okta.com"
              description={
                provider === 'saml'
                  ? 'Your IdP entity ID or SSO URL domain'
                  : provider === 'oidc'
                  ? 'Your OIDC issuer domain'
                  : 'Your Okta organization domain'
              }
            />
          ) : null
        }
      </form.Subscribe>

      <ControlledInput
        name="ssoEmail"
        label="Work Email"
        type="email"
        placeholder="you@company.com"
        description="Used to auto-detect your organization's SSO configuration"
      />

      <FormButton className="w-full">Continue with SSO</FormButton>
    </Form>
  );
}
