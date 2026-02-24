'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { incidentPostMortemSchema, type IncidentPostMortemFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface IncidentPostMortemFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: IncidentPostMortemFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<IncidentPostMortemFormData>;
}

const SEVERITY_OPTIONS = [
  { value: 'sev1', label: 'SEV-1', description: 'All hands — complete outage' },
  { value: 'sev2', label: 'SEV-2', description: 'Major degradation' },
  { value: 'sev3', label: 'SEV-3', description: 'Partial impact' },
  { value: 'sev4', label: 'SEV-4', description: 'Minor / cosmetic' },
] as const;

export function IncidentPostMortemForm({ variant = 'default', onSuccess, onError, className, defaultValues }: IncidentPostMortemFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: '',
      incidentDate: '',
      severity: 'sev2' as const,
      affectedServices: '',
      rootCause: '',
      timeline: '',
      detectionMethod: '',
      impactSummary: '',
      resolutionSteps: '',
      actionItems: '',
      lessonsLearned: '',
      participants: '',
      ...defaultValues,
    } as IncidentPostMortemFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try { onSuccess?.(incidentPostMortemSchema.parse(value)); } catch (error) { onError?.(error); }
    },
  } as any);

  const steps = [
    {
      id: 'incident',
      title: 'Incident',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput name="title" label="Incident Title" placeholder="Database connection pool exhaustion — 2026-02-18" required validators={{ onChange: incidentPostMortemSchema.shape.title }} />
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput name="incidentDate" label="Incident Date" type="date" required validators={{ onChange: incidentPostMortemSchema.shape.incidentDate }} />
            <ControlledInput name="affectedServices" label="Affected Services" placeholder="portfolio-web, cms-api, analytics" required validators={{ onChange: incidentPostMortemSchema.shape.affectedServices }} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Severity</p>
            <form.Field name="severity">
              {(field) => (
                <div className="grid grid-cols-2 gap-2">
                  {SEVERITY_OPTIONS.map(({ value, label, description }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.handleChange(value)}
                      className={cn(
                        'flex flex-col items-start rounded-md border px-3 py-2 text-left transition-all',
                        field.state.value === value ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                      )}
                    >
                      <span className={cn('text-xs font-bold', field.state.value === value && 'text-primary')}>{label}</span>
                      <span className="text-[11px] text-muted-foreground">{description}</span>
                    </button>
                  ))}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      ),
    },
    {
      id: 'analysis',
      title: 'Analysis',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledTextarea name="rootCause" label="Root Cause" placeholder="Describe the root cause — not just the symptoms, but why they occurred…" required validators={{ onChange: incidentPostMortemSchema.shape.rootCause }} />
          <ControlledTextarea name="timeline" label="Incident Timeline" placeholder="14:00 UTC — Alert fired&#10;14:05 UTC — On-call engineer paged&#10;14:12 UTC — Issue identified…" required validators={{ onChange: incidentPostMortemSchema.shape.timeline }} />
          <div className="grid grid-cols-1 gap-3">
            <ControlledInput name="detectionMethod" label="How Was It Detected?" placeholder="Automated alert / user report / uptime monitor" required validators={{ onChange: incidentPostMortemSchema.shape.detectionMethod }} />
          </div>
          <ControlledTextarea name="impactSummary" label="Impact Summary" placeholder="~200 users affected for 47 minutes. 0 data loss. 3 failed transactions." required validators={{ onChange: incidentPostMortemSchema.shape.impactSummary }} />
        </div>
      ),
    },
    {
      id: 'resolution',
      title: 'Resolution',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledTextarea name="resolutionSteps" label="Resolution Steps" placeholder="1. Increased connection pool limit…&#10;2. Restarted affected services…&#10;3. Verified recovery via health checks…" required validators={{ onChange: incidentPostMortemSchema.shape.resolutionSteps }} />
          <ControlledTextarea name="actionItems" label="Action Items" placeholder="- [ ] Add connection pool monitoring alert&#10;- [ ] Update runbook for DB exhaustion&#10;- [ ] Increase pool size in prod config" required validators={{ onChange: incidentPostMortemSchema.shape.actionItems }} />
          <ControlledTextarea name="lessonsLearned" label="Lessons Learned" placeholder="What went well? What should we improve? What surprised us?" required validators={{ onChange: incidentPostMortemSchema.shape.lessonsLearned }} />
          <ControlledInput name="participants" label="Participants" placeholder="@aldrin, @jane, @devops-team" required validators={{ onChange: incidentPostMortemSchema.shape.participants }} />
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
      <FormWizard steps={steps} onComplete={async () => { await form.handleSubmit(); }} showChallenge={true} />
    </Form>
  );
}
