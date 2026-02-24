'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { tokenAuthSchema, type TokenAuthFormData } from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface TokenAuthFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: TokenAuthFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<TokenAuthFormData>;
}

const TOKEN_TYPE_OPTIONS = [
  { value: 'bearer', label: 'Bearer', description: 'Authorization: Bearer <token>' },
  { value: 'apiKey', label: 'API Key', description: 'X-API-Key: <key>' },
  { value: 'jwt', label: 'JWT', description: 'JSON Web Token' },
  { value: 'oauth', label: 'OAuth', description: 'OAuth 2.0 access token' },
] as const;

export function TokenAuthForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: TokenAuthFormProps) {
  const [showToken, setShowToken] = React.useState(false);

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      token: '',
      tokenType: 'bearer' as const,
      label: '',
      expiresAt: '',
      ...defaultValues,
    } as TokenAuthFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = tokenAuthSchema.parse(value);
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

      {/* Token type selector */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Token Type</p>
        <form.Field name="tokenType">
          {(field) => (
            <div className="grid grid-cols-2 gap-2">
              {TOKEN_TYPE_OPTIONS.map(({ value, label, description }) => (
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
                  <span
                    className={cn(
                      'text-xs font-bold',
                      field.state.value === value && 'text-primary'
                    )}
                  >
                    {label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{description}</span>
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      {/* Token value with show/hide toggle */}
      <form.Field name="token" validators={{ onChange: tokenAuthSchema.shape.token }}>
        {(field) => (
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Token <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                value={(field.state.value as string) || ''}
                onChange={(e) => field.handleChange(e.target.value)}
                type={showToken ? 'text' : 'password'}
                placeholder={showToken ? 'eyJhbGciOiJIUzI1NiJ9…' : '••••••••••••••••'}
                autoComplete="off"
                className="w-full rounded-md border border-input bg-background pr-10 pl-3 py-2 font-mono text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowToken((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showToken ? 'Hide token' : 'Show token'}
              >
                {showToken ? '🙈' : '👁️'}
              </button>
            </div>
            {field.state.meta.errors?.length > 0 && (
              <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
            )}
          </div>
        )}
      </form.Field>

      <ControlledInput
        name="label"
        label="Label"
        placeholder="Production API key"
        description="Optional — helps identify this token later"
        validators={{ onChange: tokenAuthSchema.shape.label }}
      />

      <ControlledInput
        name="expiresAt"
        label="Expiry Date"
        type="date"
        description="Optional — leave blank if the token does not expire"
      />

      <FormButton className="w-full">Authenticate</FormButton>
    </Form>
  );
}
