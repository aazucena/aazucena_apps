'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { communityReportSchema, type CommunityReportFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface CommunityReportFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: CommunityReportFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<CommunityReportFormData>;
}

const VIOLATION_OPTIONS = [
  { value: 'harassment', label: 'Harassment' },
  { value: 'spam', label: 'Spam' },
  { value: 'abuse', label: 'Abuse' },
  { value: 'off_topic', label: 'Off Topic' },
  { value: 'other', label: 'Other' },
] as const;

const ACTION_OPTIONS = [
  { value: 'remove_content', label: 'Remove Content' },
  { value: 'warn_user', label: 'Warn User' },
  { value: 'ban_user', label: 'Ban User' },
  { value: 'no_action', label: 'No Action Needed' },
] as const;

export function CommunityReportForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: CommunityReportFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      violationType: 'harassment' as const,
      contentUrl: '',
      description: '',
      anonymous: false,
      requestedAction: 'remove_content' as const,
      ...defaultValues,
    } as CommunityReportFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(communityReportSchema.parse(value));
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

      {/* Violation type */}
      <div className="space-y-2">
        <p className="text-sm font-medium">
          Type of violation <span className="text-destructive">*</span>
        </p>
        <form.Field
          name="violationType"
          validators={{ onChange: communityReportSchema.shape.violationType }}
        >
          {(field) => (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {VIOLATION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.handleChange(opt.value)}
                  className={cn(
                    'rounded-md border px-3 py-2 text-sm font-medium transition-all',
                    field.state.value === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/40',
                  )}
                >
                  {opt.label}
                </button>
              ))}
              {field.state.meta.errors.length > 0 && (
                <p className="col-span-2 text-xs text-destructive sm:col-span-3">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledInput
        name="contentUrl"
        label="Link to reported content"
        type="url"
        placeholder="https://github.com/org/repo/issues/123"
        required
        validators={{ onChange: communityReportSchema.shape.contentUrl }}
      />

      <ControlledTextarea
        name="description"
        label="Description"
        placeholder="Describe the violation in detail. What happened and why it violates community guidelines…"
        required
        validators={{ onChange: communityReportSchema.shape.description }}
      />

      {/* Requested action */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Requested action</p>
        <form.Field
          name="requestedAction"
          validators={{ onChange: communityReportSchema.shape.requestedAction }}
        >
          {(field) => (
            <div className="grid grid-cols-2 gap-2">
              {ACTION_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => field.handleChange(opt.value)}
                  className={cn(
                    'rounded-md border px-3 py-2 text-sm font-medium transition-all',
                    field.state.value === opt.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background hover:border-primary/40',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledCheckbox
        name="anonymous"
        label="Submit this report anonymously"
        description="Your identity will not be shared with the reported user."
      />

      <FormButton className="w-full">Submit Report</FormButton>
    </Form>
  );
}
