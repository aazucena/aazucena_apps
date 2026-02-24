'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { maintainerApplicationSchema, type MaintainerApplicationFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface MaintainerApplicationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: MaintainerApplicationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<MaintainerApplicationFormData>;
}

const FOCUS_OPTIONS = ['code_review', 'bug_fixes', 'documentation', 'testing', 'triaging', 'releases'];
const FOCUS_LABELS: Record<string, string> = {
  code_review: 'Code Review', bug_fixes: 'Bug Fixes', documentation: 'Documentation',
  testing: 'Testing', triaging: 'Triaging', releases: 'Releases',
};

export function MaintainerApplicationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: MaintainerApplicationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      repo: '',
      githubHandle: '',
      motivation: '',
      contributionHistory: '',
      availability: 5,
      areasOfFocus: [],
      ...defaultValues,
    } as MaintainerApplicationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = maintainerApplicationSchema.parse(value);
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

      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="repo"
          label="Repository"
          placeholder="owner/repo-name"
          required
          validators={{ onChange: maintainerApplicationSchema.shape.repo }}
        />
        <ControlledInput
          name="githubHandle"
          label="GitHub Handle"
          placeholder="@your-handle"
          required
          validators={{ onChange: maintainerApplicationSchema.shape.githubHandle }}
        />
      </div>

      <ControlledTextarea
        name="motivation"
        label="Motivation"
        placeholder="Why do you want to become a maintainer of this project?"
        required
        validators={{ onChange: maintainerApplicationSchema.shape.motivation }}
      />

      <ControlledTextarea
        name="contributionHistory"
        label="Contribution History"
        placeholder="Describe your past contributions — PRs merged, issues resolved, discussions participated in…"
        required
        validators={{ onChange: maintainerApplicationSchema.shape.contributionHistory }}
      />

      <ControlledInput
        name="availability"
        label="Availability (hours/week)"
        type="number"
        min="1"
        max="40"
        placeholder="5"
        required
        validators={{ onChange: maintainerApplicationSchema.shape.availability }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Areas of Focus</p>
        <form.Field name="areasOfFocus">
          {(field) => {
            const selected: string[] = (field.state.value as string[]) || [];
            return (
              <div className="flex flex-wrap gap-2">
                {FOCUS_OPTIONS.map((f) => {
                  const isSelected = selected.includes(f);
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        const next = isSelected ? selected.filter((x) => x !== f) : [...selected, f];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                        isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                      )}
                    >
                      {FOCUS_LABELS[f]}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>

      <FormButton className="w-full">Apply as Maintainer</FormButton>
    </Form>
  );
}
