'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { hardwareKeySchema, type HardwareKeyFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface HardwareKeyFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: HardwareKeyFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<HardwareKeyFormData>;
}

const ATTACHMENT_OPTIONS = [
  { value: 'any', label: 'Any', description: 'USB, NFC, or built-in' },
  { value: 'cross-platform', label: 'External', description: 'USB / NFC security key' },
  { value: 'platform', label: 'Built-in', description: 'Device TPM / Secure Enclave' },
] as const;

const VERIFICATION_OPTIONS = [
  { value: 'preferred', label: 'Preferred', description: 'Use PIN if available' },
  { value: 'required', label: 'Required', description: 'Always verify with PIN/biometric' },
  { value: 'discouraged', label: 'Discouraged', description: 'Presence-only (tap key)' },
] as const;

const ATTESTATION_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'indirect', label: 'Indirect' },
  { value: 'direct', label: 'Direct' },
] as const;

export function HardwareKeyForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: HardwareKeyFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      keyNickname: '',
      authenticatorAttachment: 'any' as const,
      userVerification: 'preferred' as const,
      requireResidentKey: false,
      attestationType: 'none' as const,
      ...defaultValues,
    } as HardwareKeyFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = hardwareKeySchema.parse(value);
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

      <div className="flex items-center gap-3 rounded-md border border-border bg-muted/30 px-4 py-3">
        <span className="text-3xl">🔑</span>
        <div>
          <p className="text-sm font-medium">FIDO2 / WebAuthn Security Key</p>
          <p className="text-xs text-muted-foreground">
            Register a hardware authenticator (YubiKey, Titan, etc.)
          </p>
        </div>
      </div>

      <ControlledInput
        name="keyNickname"
        label="Key Nickname"
        placeholder="YubiKey 5 NFC"
        description="A friendly name to identify this key in your account"
        required
        validators={{ onChange: hardwareKeySchema.shape.keyNickname }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Authenticator Attachment</p>
        <form.Field name="authenticatorAttachment">
          {(field) => (
            <div className="grid grid-cols-3 gap-2">
              {ATTACHMENT_OPTIONS.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex flex-col items-start rounded-md border px-2.5 py-2 text-left transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className={cn('text-xs font-bold', field.state.value === value && 'text-primary')}>
                    {label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{description}</span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">User Verification</p>
        <form.Field name="userVerification">
          {(field) => (
            <div className="grid grid-cols-1 gap-1.5">
              {VERIFICATION_OPTIONS.map(({ value, label, description }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex items-center justify-between rounded-md border px-3 py-2 text-left transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className={cn('text-xs font-medium', field.state.value === value && 'text-primary')}>
                    {label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{description}</span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledCheckbox
        name="requireResidentKey"
        label="Require resident key (passkey / discoverable credential)"
        description="Key stores user identity on device — enables passwordless login"
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Attestation Type</p>
        <form.Field name="attestationType">
          {(field) => (
            <div className="flex gap-2">
              {ATTESTATION_OPTIONS.map(({ value, label }) => (
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

      <FormButton className="w-full">Register Security Key</FormButton>
    </Form>
  );
}
