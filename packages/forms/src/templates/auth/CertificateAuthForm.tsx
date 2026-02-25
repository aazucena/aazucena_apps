'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { certificateAuthSchema, type CertificateAuthFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface CertificateAuthFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: CertificateAuthFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<CertificateAuthFormData>;
}

export function CertificateAuthForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: CertificateAuthFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      certificatePem: '',
      privateKeyPem: '',
      passphrase: '',
      rememberCertificate: false,
      ...defaultValues,
    } as CertificateAuthFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = certificateAuthSchema.parse(value);
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

      <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2">
        <p className="text-xs text-amber-600 dark:text-amber-400">
          🔒 Certificate data is transmitted over TLS and never stored on the server.
        </p>
      </div>

      <ControlledTextarea
        name="certificatePem"
        label="Client Certificate (PEM)"
        placeholder="-----BEGIN CERTIFICATE-----&#10;MIIBxTCCAW+gAwIBAgIJAP...&#10;-----END CERTIFICATE-----"
        required
        validators={{ onChange: certificateAuthSchema.shape.certificatePem }}
        style={{ fontFamily: 'monospace', fontSize: '11px' }}
        rows={5}
      />

      <ControlledTextarea
        name="privateKeyPem"
        label="Private Key (PEM)"
        placeholder="-----BEGIN PRIVATE KEY-----&#10;MIIEvgIBADANBgkqhkiG9w0B...&#10;-----END PRIVATE KEY-----"
        description="Optional — required only if not embedded in the certificate file"
        style={{ fontFamily: 'monospace', fontSize: '11px' }}
        rows={4}
      />

      <ControlledInput
        name="passphrase"
        label="Key Passphrase"
        type="password"
        placeholder="••••••••"
        description="Leave blank if the private key is not encrypted"
      />

      <ControlledCheckbox
        name="rememberCertificate"
        label="Remember this certificate for this session"
      />

      <FormButton className="w-full">Authenticate with Certificate</FormButton>
    </Form>
  );
}
