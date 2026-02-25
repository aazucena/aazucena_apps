'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { teamOnboardingSchema, type TeamOnboardingFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledSwitch } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface TeamOnboardingFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: TeamOnboardingFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<TeamOnboardingFormData>;
}

const PLAN_OPTIONS = [
  { value: 'free', label: 'Free', description: 'Up to 5 members, basic features' },
  { value: 'pro', label: 'Pro', description: 'Unlimited members, advanced analytics' },
  { value: 'enterprise', label: 'Enterprise', description: 'SSO, audit logs, SLA' },
] as const;

export function TeamOnboardingForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: TeamOnboardingFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      orgName: '',
      plan: 'free' as const,
      inviteEmails: '',
      roles: 'editor' as const,
      slackIntegration: false,
      teamsIntegration: false,
      emailIntegration: true,
      ...defaultValues,
    } as TeamOnboardingFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = teamOnboardingSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'organization',
      title: 'Organization',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput
            name="orgName"
            label="Organization Name"
            placeholder="Acme Corp"
            required
            validators={{ onChange: teamOnboardingSchema.shape.orgName }}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Plan</p>
            <form.Field name="plan">
              {(field) => (
                <div className="space-y-2">
                  {PLAN_OPTIONS.map(({ value, label, description }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.handleChange(value)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all',
                        field.state.value === value
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      <div
                        className={cn(
                          'h-3 w-3 rounded-full border-2 transition-all',
                          field.state.value === value
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground',
                        )}
                      />
                      <div>
                        <p className="text-sm font-semibold">{label}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                      </div>
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
      id: 'invite',
      title: 'Invite Team',
      component: (
        <div className="space-y-4">
          <ControlledTextarea
            name="inviteEmails"
            label="Invite Members"
            placeholder="alice@example.com&#10;bob@example.com"
            description="One email address per line"
            required
            validators={{ onChange: teamOnboardingSchema.shape.inviteEmails }}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Default Role</p>
            <form.Field name="roles">
              {(field) => (
                <div className="flex gap-2">
                  {(['viewer', 'editor', 'admin'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => field.handleChange(role)}
                      className={cn(
                        'flex-1 rounded-md border px-3 py-2 text-xs font-medium capitalize transition-all',
                        field.state.value === role
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50',
                      )}
                    >
                      {role}
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
      id: 'integrations',
      title: 'Integrations',
      component: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Connect your team's communication channels
          </p>
          <ControlledSwitch
            name="emailIntegration"
            label="Email Notifications"
            description="Receive updates via email (recommended)"
          />
          <ControlledSwitch
            name="slackIntegration"
            label="Slack"
            description="Post updates to a Slack channel"
          />
          <ControlledSwitch
            name="teamsIntegration"
            label="Microsoft Teams"
            description="Post updates to a Teams channel"
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
