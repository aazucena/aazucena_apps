'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { mfaSetupSchema, type MFASetupFormData } from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface MFASetupFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: MFASetupFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<MFASetupFormData>;
}

const METHOD_OPTIONS = [
  {
    value: 'authenticatorApp',
    label: 'Authenticator App',
    description: 'Google Authenticator, Authy, 1Password',
    icon: '🔐',
  },
  {
    value: 'sms',
    label: 'SMS',
    description: 'Text message to your phone number',
    icon: '📱',
  },
  {
    value: 'email',
    label: 'Email',
    description: 'Code sent to your email address',
    icon: '📧',
  },
  {
    value: 'hardwareKey',
    label: 'Hardware Key',
    description: 'YubiKey or FIDO2 security key',
    icon: '🔑',
  },
] as const;

export function MFASetupForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: MFASetupFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      method: 'authenticatorApp' as const,
      contactDetail: '',
      verificationCode: '',
      ...defaultValues,
    } as MFASetupFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = mfaSetupSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'method',
      title: 'Choose Method',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <p className="text-sm text-muted-foreground">
            Select how you'd like to receive your multi-factor authentication codes.
          </p>
          <form.Field name="method">
            {(field) => (
              <div className="grid grid-cols-1 gap-2">
                {METHOD_OPTIONS.map(({ value, label, description, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.handleChange(value)}
                    className={cn(
                      'flex items-center gap-3 rounded-md border px-4 py-3 text-left transition-all',
                      field.state.value === value
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <span className="text-xl">{icon}</span>
                    <div>
                      <p className={cn('text-sm font-medium', field.state.value === value && 'text-primary')}>
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state: any) => state.values.method}>
            {(method) =>
              method === 'sms' ? (
                <ControlledInput
                  name="contactDetail"
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  description="We'll send a verification code to this number"
                />
              ) : method === 'email' ? (
                <ControlledInput
                  name="contactDetail"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  description="We'll send a verification code to this email"
                />
              ) : null
            }
          </form.Subscribe>
        </div>
      ),
    },
    {
      id: 'verify',
      title: 'Verify',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit verification code to confirm your MFA setup.
          </p>
          <form.Field name="verificationCode" validators={{ onChange: mfaSetupSchema.shape.verificationCode }}>
            {(field) => (
              <div className="space-y-1">
                <label className="text-sm font-medium">Verification Code</label>
                <input
                  value={(field.state.value as string) || ''}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 6);
                    field.handleChange(raw);
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  maxLength={6}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {field.state.meta.errors?.length > 0 && (
                  <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      ),
    },
  ];

  return (
    <Form
      form={form}
      variant={variant}
      className={cn('max-w-md', className)}
      onSubmit={(e) => e.preventDefault()}
    >
      <FormWizard steps={steps} onComplete={async () => { await form.handleSubmit(); }} showChallenge={true} />
    </Form>
  );
}
