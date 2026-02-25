'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { technicalAuditSchema, type TechnicalAuditFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface TechnicalAuditRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: TechnicalAuditFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<TechnicalAuditFormData>;
}

const AUDIT_SCOPES = [
  { value: 'security', label: 'Security', icon: '🔒' },
  { value: 'performance', label: 'Performance', icon: '⚡' },
  { value: 'architecture', label: 'Architecture', icon: '🏗️' },
  { value: 'accessibility', label: 'Accessibility', icon: '♿' },
  { value: 'all', label: 'Full Audit', icon: '🔍' },
] as const;

export function TechnicalAuditRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: TechnicalAuditRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      projectUrl: '',
      techStack: '',
      auditScope: 'all' as const,
      painPoints: '',
      timeline: '',
      budget: '',
      ...defaultValues,
    } as TechnicalAuditFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(technicalAuditSchema.parse(value));
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
        name="projectUrl"
        label="Project URL"
        placeholder="https://github.com/your/repo or https://yourapp.com"
        type="url"
        required
        validators={{ onChange: technicalAuditSchema.shape.projectUrl }}
      />
      <ControlledTextarea
        name="techStack"
        label="Tech Stack"
        placeholder="Next.js, PostgreSQL, Redis, deployed on Railway…"
        required
        validators={{ onChange: technicalAuditSchema.shape.techStack }}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium">Audit Scope</p>
        <form.Field name="auditScope">
          {(field) => (
            <div className="grid grid-cols-3 gap-2">
              {AUDIT_SCOPES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => field.handleChange(value)}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-md border px-2 py-3 text-xs font-medium transition-all',
                    field.state.value === value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background hover:border-primary/50',
                  )}
                >
                  <span className="text-base">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>
      <ControlledTextarea
        name="painPoints"
        label="Pain Points"
        placeholder="What's keeping you up at night? Slow queries, scaling issues, security concerns…"
        required
        validators={{ onChange: technicalAuditSchema.shape.painPoints }}
      />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="timeline"
          label="Timeline"
          placeholder="Need results within 2 weeks"
          required
          validators={{ onChange: technicalAuditSchema.shape.timeline }}
        />
        <ControlledInput name="budget" label="Budget (optional)" placeholder="$500-$2k" />
      </div>
      <FormButton className="w-full">Request Audit</FormButton>
    </Form>
  );
}
