'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { escalationSchema, type EscalationFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface EscalationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: EscalationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<EscalationFormData>;
}

const SEVERITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'text-green-500' },
  { value: 'medium', label: 'Medium', color: 'text-amber-500' },
  { value: 'high', label: 'High', color: 'text-orange-500' },
  { value: 'critical', label: 'Critical', color: 'text-red-500' },
] as const;

const REASON_OPTIONS = [
  { value: 'sla_breach', label: 'SLA Breach' },
  { value: 'customer_at_risk', label: 'Customer at Risk' },
  { value: 'data_loss', label: 'Data Loss' },
  { value: 'security', label: 'Security' },
  { value: 'regulatory', label: 'Regulatory' },
] as const;

export function EscalationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: EscalationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      ticketId: '',
      currentSeverity: 'medium' as const,
      requestedSeverity: 'high' as const,
      businessImpact: '',
      revenueEstimate: '',
      escalationReason: 'sla_breach' as const,
      executiveSponsor: '',
      ...defaultValues,
    } as EscalationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = escalationSchema.parse(value);
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
        name="ticketId"
        label="Ticket ID"
        placeholder="TKT-4521"
        required
        validators={{ onChange: escalationSchema.shape.ticketId }}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Current Severity</p>
          <form.Field name="currentSeverity">
            {(field) => (
              <div className="flex flex-col gap-1">
                {SEVERITY_OPTIONS.map(({ value, label, color }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.handleChange(value)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-xs font-medium transition-all text-left',
                      field.state.value === value
                        ? `border-primary bg-primary/10 ${color}`
                        : 'border-border hover:border-primary/50',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </form.Field>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Requested Severity</p>
          <form.Field name="requestedSeverity">
            {(field) => (
              <div className="flex flex-col gap-1">
                {SEVERITY_OPTIONS.filter((s) => s.value !== 'low').map(
                  ({ value, label, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.handleChange(value as 'medium' | 'high' | 'critical')}
                      className={cn(
                        'rounded-md border px-3 py-1.5 text-xs font-medium transition-all text-left',
                        field.state.value === value
                          ? `border-primary bg-primary/10 ${color}`
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      {label}
                    </button>
                  ),
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Escalation Reason</p>
        <form.Field name="escalationReason">
          {(field) => (
            <div className="flex flex-wrap gap-2">
              {REASON_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledTextarea
        name="businessImpact"
        label="Business Impact"
        placeholder="Describe the impact to customers, revenue, or operations…"
        required
        validators={{ onChange: escalationSchema.shape.businessImpact }}
      />

      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="revenueEstimate"
          label="Revenue at Risk"
          placeholder="$X,000/hr"
          description="Optional estimate"
        />
        <ControlledInput
          name="executiveSponsor"
          label="Executive Sponsor"
          placeholder="name@company.com"
          description="Optional"
        />
      </div>

      <FormButton className="w-full">Escalate Ticket</FormButton>
    </Form>
  );
}
