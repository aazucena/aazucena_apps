'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { releaseNotesSchema, type ReleaseNotesFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface ReleaseNotesFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: ReleaseNotesFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<ReleaseNotesFormData>;
}

const RELEASE_TYPE_OPTIONS = [
  { value: 'patch', label: 'Patch', color: 'text-green-500', border: 'border-green-500/50 bg-green-500/10' },
  { value: 'minor', label: 'Minor', color: 'text-blue-500', border: 'border-blue-500/50 bg-blue-500/10' },
  { value: 'major', label: 'Major', color: 'text-red-500', border: 'border-red-500/50 bg-red-500/10' },
] as const;

const PUBLISH_OPTIONS = ['npm', 'github', 'slack', 'twitter', 'discord', 'blog'];

export function ReleaseNotesForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: ReleaseNotesFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      version: '',
      releaseType: 'minor' as const,
      breakingChanges: '',
      features: '',
      bugFixes: '',
      docs: '',
      migrationGuide: '',
      publishChannels: [],
      ...defaultValues,
    } as ReleaseNotesFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = releaseNotesSchema.parse(value);
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
      className={cn('max-w-lg space-y-4', className)}
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
    >
      <FormErrorSummary />

      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <ControlledInput
            name="version"
            label="Version"
            placeholder="1.2.3"
            required
            validators={{ onChange: releaseNotesSchema.shape.version }}
          />
        </div>
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Type</p>
          <form.Field name="releaseType">
            {(field) => (
              <div className="flex gap-1">
                {RELEASE_TYPE_OPTIONS.map(({ value, label, color, border }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.handleChange(value)}
                    className={cn(
                      'rounded-md border px-3 py-2 text-xs font-bold transition-all',
                      field.state.value === value ? `${border} ${color}` : 'border-border hover:border-primary/50'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </form.Field>
        </div>
      </div>

      <ControlledTextarea name="features" label="New Features" placeholder="• Added support for dark mode&#10;• New API endpoint for webhooks" />
      <ControlledTextarea name="bugFixes" label="Bug Fixes" placeholder="• Fixed crash when submitting empty form&#10;• Resolved memory leak in animation loop" />
      <ControlledTextarea name="breakingChanges" label="Breaking Changes" placeholder="• Removed deprecated `onComplete` prop — use `onSuccess` instead" />
      <ControlledTextarea name="docs" label="Documentation" placeholder="• Updated API reference for new endpoints" />
      <ControlledTextarea name="migrationGuide" label="Migration Guide" placeholder="Step-by-step instructions for upgrading from the previous version…" description="Optional — include for breaking changes" />

      <div className="space-y-2">
        <p className="text-sm font-medium">Publish To</p>
        <form.Field name="publishChannels">
          {(field) => {
            const selected: string[] = (field.state.value as string[]) || [];
            return (
              <div className="flex flex-wrap gap-2">
                {PUBLISH_OPTIONS.map((ch) => {
                  const isSelected = selected.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => {
                        const next = isSelected ? selected.filter((x) => x !== ch) : [...selected, ch];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all',
                        isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                      )}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>

      <FormButton className="w-full">Publish Release Notes</FormButton>
    </Form>
  );
}
