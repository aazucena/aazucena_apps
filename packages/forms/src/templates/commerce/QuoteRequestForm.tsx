'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { quoteRequestSchema, type QuoteRequestFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormWizard } from '../../components/FormWizard';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface QuoteRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: QuoteRequestFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<QuoteRequestFormData>;
}

const DELIVERABLE_OPTIONS = [
  'design',
  'development',
  'consulting',
  'maintenance',
  'testing',
  'documentation',
];
const BUDGET_OPTIONS = [
  { value: '<$5k', label: '< $5k' },
  { value: '$5k-$20k', label: '$5k – $20k' },
  { value: '$20k-$100k', label: '$20k – $100k' },
  { value: '$100k+', label: '$100k+' },
] as const;

export function QuoteRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: QuoteRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      projectType: '',
      scope: '',
      deliverables: [],
      timeline: '',
      budgetRange: '$5k-$20k' as const,
      name: '',
      email: '',
      ...defaultValues,
    } as QuoteRequestFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = quoteRequestSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'scope',
      title: 'Project Scope',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput
            name="projectType"
            label="Project Type"
            placeholder="e.g. Web Application, Mobile App, API"
            required
            validators={{ onChange: quoteRequestSchema.shape.projectType }}
          />
          <ControlledTextarea
            name="scope"
            label="Project Scope"
            placeholder="Describe what you need built…"
            required
            validators={{ onChange: quoteRequestSchema.shape.scope }}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Deliverables</p>
            <form.Field name="deliverables">
              {(field) => {
                const selected: string[] = (field.state.value as string[]) || [];
                return (
                  <div className="flex flex-wrap gap-2">
                    {DELIVERABLE_OPTIONS.map((d) => {
                      const isSelected = selected.includes(d);
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            const next = isSelected
                              ? selected.filter((x) => x !== d)
                              : [...selected, d];
                            field.handleChange(next);
                          }}
                          className={cn(
                            'rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all',
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50',
                          )}
                        >
                          {d}
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
    {
      id: 'contact',
      title: 'Timeline & Contact',
      component: (
        <div className="space-y-4">
          <ControlledInput
            name="timeline"
            label="Timeline"
            placeholder="e.g. 3 months, Q3 2024"
            required
            validators={{ onChange: quoteRequestSchema.shape.timeline }}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Budget Range</p>
            <form.Field name="budgetRange">
              {(field) => (
                <div className="grid grid-cols-2 gap-2">
                  {BUDGET_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.handleChange(value)}
                      className={cn(
                        'rounded-md border px-3 py-2 text-xs font-medium transition-all',
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
            name="name"
            label="Your Name"
            placeholder="Jane Smith"
            required
            validators={{ onChange: quoteRequestSchema.shape.name }}
          />
          <ControlledInput
            name="email"
            label="Email"
            type="email"
            placeholder="jane@company.com"
            required
            validators={{ onChange: quoteRequestSchema.shape.email }}
          />
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
