'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { deploymentTriggerSchema, type DeploymentTriggerFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface DeploymentTriggerFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: DeploymentTriggerFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<DeploymentTriggerFormData>;
}

const ENV_CONFIG = {
  staging: { label: 'Staging', icon: '🧪', description: 'Safe to test' },
  preview: { label: 'Preview', icon: '👁️', description: 'Shareable preview' },
  production: { label: 'Production', icon: '🚀', description: 'Live — be sure!' },
} as const;

export function DeploymentTriggerForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: DeploymentTriggerFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      environment: 'staging' as const,
      service: '',
      versionTag: '',
      deploymentNotes: '',
      confirmDeployment: false,
      ...defaultValues,
    } as DeploymentTriggerFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(deploymentTriggerSchema.parse(value));
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
      <div className="space-y-2">
        <p className="text-sm font-medium">Target Environment</p>
        <form.Field name="environment">
          {(field) => (
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(ENV_CONFIG) as Array<keyof typeof ENV_CONFIG>).map((env) => {
                const config = ENV_CONFIG[env];
                const isActive = field.state.value === env;
                const isProd = env === 'production';
                return (
                  <button
                    key={env}
                    type="button"
                    onClick={() => field.handleChange(env)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-md border px-2 py-3 text-xs font-medium transition-all',
                      isActive
                        ? isProd
                          ? 'border-red-500 bg-red-600 text-white'
                          : 'border-primary bg-primary text-primary-foreground'
                        : isProd
                          ? 'border-red-200 text-red-600 hover:border-red-400'
                          : 'border-border hover:border-primary/50',
                    )}
                  >
                    <span className="text-base">{config.icon}</span>
                    <span>{config.label}</span>
                    <span className={cn('text-[10px] opacity-70', isActive && 'opacity-90')}>
                      {config.description}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </form.Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="service"
          label="Service"
          placeholder="portfolio-web"
          required
          validators={{ onChange: deploymentTriggerSchema.shape.service }}
        />
        <ControlledInput
          name="versionTag"
          label="Version Tag"
          placeholder="v2.1.0 or SHA abc123"
          required
          validators={{ onChange: deploymentTriggerSchema.shape.versionTag }}
        />
      </div>
      <ControlledTextarea
        name="deploymentNotes"
        label="Deployment Notes (optional)"
        placeholder="What's changing? Any rollback plan?"
      />
      <ControlledCheckbox
        name="confirmDeployment"
        label="I confirm this deployment is intentional and I have reviewed the changes"
        required
        validators={{ onChange: deploymentTriggerSchema.shape.confirmDeployment }}
      />
      <FormButton className="w-full">Trigger Deployment</FormButton>
    </Form>
  );
}
