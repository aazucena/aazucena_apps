'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { featureFlagSchema, type FeatureFlagFormData } from '../../schemas/index';
import { ControlledInput, ControlledSwitch } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface FeatureFlagFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: FeatureFlagFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<FeatureFlagFormData>;
}

const ENV_CONFIG = {
  dev: {
    label: 'Dev',
    activeClass: 'border-success bg-success text-success-foreground',
    hoverClass: 'border-green-200 text-green-700 hover:border-success',
  },
  staging: {
    label: 'Staging',
    activeClass: 'border-warning bg-warning text-warning-foreground',
    hoverClass: 'border-amber-200 text-amber-700 hover:border-warning',
  },
  prod: {
    label: 'Prod',
    activeClass: 'border-alert bg-alert text-alert-foreground',
    hoverClass: 'border-red-200 text-alert hover:border-alert',
  },
} as const;

const TARGET_GROUPS = [
  { value: 'internal', label: 'Internal' },
  { value: 'beta_users', label: 'Beta Users' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'all', label: 'All' },
] as const;

export function FeatureFlagForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: FeatureFlagFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      flagKey: '',
      displayName: '',
      environment: 'dev' as const,
      enabled: false,
      rolloutPercentage: 0,
      targetGroups: [] as string[],
      expiresAt: '',
      ...defaultValues,
    } as FeatureFlagFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = featureFlagSchema.parse(value);
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
      className={cn('max-w-md space-y-5', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />

      <ControlledInput
        name="flagKey"
        label="Flag Key"
        placeholder="my_feature_flag"
        required
        description="lowercase + underscores only"
        validators={{ onChange: featureFlagSchema.shape.flagKey }}
      />

      <ControlledInput
        name="displayName"
        label="Display Name"
        required
        validators={{ onChange: featureFlagSchema.shape.displayName }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Environment</p>
        <form.Field name="environment">
          {(field) => (
            <div className="flex gap-2">
              {(Object.keys(ENV_CONFIG) as Array<keyof typeof ENV_CONFIG>).map((env) => {
                const config = ENV_CONFIG[env];
                const isActive = field.state.value === env;
                return (
                  <button
                    key={env}
                    type="button"
                    onClick={() => field.handleChange(env)}
                    className={cn(
                      'flex-1 rounded-md border px-3 py-2 text-xs font-semibold transition-all',
                      isActive ? config.activeClass : config.hoverClass,
                    )}
                  >
                    {config.label}
                  </button>
                );
              })}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledSwitch
        name="enabled"
        label="Enabled"
        description="Toggle this flag on or off globally"
      />

      <div className="space-y-2">
        <form.Subscribe selector={(state: any) => state.values.rolloutPercentage}>
          {(pct) => (
            <p className="text-sm font-medium">
              Rollout Percentage — <span className="text-primary font-bold">{pct ?? 0}%</span>
            </p>
          )}
        </form.Subscribe>
        <form.Field name="rolloutPercentage">
          {(field) => (
            <input
              aria-label="Rollout percentage"
              type="range"
              min={0}
              max={100}
              step={5}
              value={(field.state.value as number) ?? 0}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="w-full accent-primary"
            />
          )}
        </form.Field>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Target Groups</p>
        <form.Field name="targetGroups">
          {(field) => (
            <div className="flex flex-wrap gap-2">
              {TARGET_GROUPS.map(({ value, label }) => {
                const current = (field.state.value as string[]) ?? [];
                const isSelected = current.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      field.handleChange(
                        isSelected ? current.filter((g) => g !== value) : [...current, value],
                      )
                    }
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-medium transition-all',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/40',
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </form.Field>
      </div>

      <ControlledInput name="expiresAt" label="Expires At (optional)" type="date" />

      <FormButton className="w-full">Save Feature Flag</FormButton>
    </Form>
  );
}
