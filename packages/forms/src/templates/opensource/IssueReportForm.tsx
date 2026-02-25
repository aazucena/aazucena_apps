'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { issueReportSchema, type IssueReportFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface IssueReportFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: IssueReportFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<IssueReportFormData>;
}

const ISSUE_TYPE_OPTIONS = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'docs', label: 'Documentation' },
  { value: 'question', label: 'Question' },
] as const;

const REPRODUCIBILITY_OPTIONS = [
  { value: 'always', label: 'Always' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'rarely', label: 'Rarely' },
  { value: 'once', label: 'Once' },
] as const;

const LABEL_OPTIONS = ['bug', 'enhancement', 'documentation', 'good_first_issue', 'help_wanted'];
const LABEL_DISPLAY: Record<string, string> = {
  bug: 'bug',
  enhancement: 'enhancement',
  documentation: 'documentation',
  good_first_issue: 'good first issue',
  help_wanted: 'help wanted',
};

export function IssueReportForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: IssueReportFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      issueType: 'bug' as const,
      title: '',
      description: '',
      reproducibility: undefined,
      environment: '',
      labels: [],
      ...defaultValues,
    } as IssueReportFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = issueReportSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'issue',
      title: 'Issue',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <div className="space-y-2">
            <p className="text-sm font-medium">Issue Type</p>
            <form.Field name="issueType">
              {(field) => (
                <div className="flex gap-2 flex-wrap">
                  {ISSUE_TYPE_OPTIONS.map(({ value, label }) => (
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
          <ControlledInput
            name="title"
            label="Title"
            placeholder="Brief description of the issue"
            required
            validators={{ onChange: issueReportSchema.shape.title }}
          />
          <ControlledTextarea
            name="description"
            label="Description"
            placeholder="Provide a clear and detailed description…"
            required
            validators={{ onChange: issueReportSchema.shape.description }}
          />
        </div>
      ),
    },
    {
      id: 'environment',
      title: 'Environment',
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Reproducibility</p>
            <form.Field name="reproducibility">
              {(field) => (
                <div className="flex gap-2">
                  {REPRODUCIBILITY_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.handleChange(value)}
                      className={cn(
                        'flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-all',
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
            name="environment"
            label="Environment"
            placeholder="OS: macOS 14&#10;Browser: Chrome 120&#10;Node: 20.x&#10;Package version: 1.2.3"
            description="OS, browser, runtime versions, etc."
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Labels</p>
            <form.Field name="labels">
              {(field) => {
                const selected: string[] = (field.state.value as string[]) || [];
                return (
                  <div className="flex flex-wrap gap-2">
                    {LABEL_OPTIONS.map((l) => {
                      const isSelected = selected.includes(l);
                      return (
                        <button
                          key={l}
                          type="button"
                          onClick={() => {
                            const next = isSelected
                              ? selected.filter((x) => x !== l)
                              : [...selected, l];
                            field.handleChange(next);
                          }}
                          className={cn(
                            'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50',
                          )}
                        >
                          {LABEL_DISPLAY[l]}
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            </form.Field>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Form
      form={form}
      variant={variant}
      className={cn('max-w-lg', className)}
      onSubmit={(e) => e.preventDefault()}
    >
      <FormWizard
        steps={steps}
        onComplete={async () => {
          await form.handleSubmit();
        }}
        showChallenge={false}
      />
    </Form>
  );
}
