'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { maintenanceWindowSchema, type MaintenanceWindowFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface MaintenanceWindowFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: MaintenanceWindowFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<MaintenanceWindowFormData>;
}

const SERVICE_OPTIONS = ['API', 'Dashboard', 'Database', 'Auth', 'CDN', 'Webhooks', 'Email'];

export function MaintenanceWindowForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: MaintenanceWindowFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      environment: 'staging' as const,
      startTime: '',
      endTime: '',
      description: '',
      affectedServices: [],
      notifyUsers: true,
      rollbackPlan: '',
      ...defaultValues,
    } as MaintenanceWindowFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = maintenanceWindowSchema.parse(value);
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
      className={cn('max-w-md space-y-4', className)}
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
    >
      <FormErrorSummary />

      <div className="space-y-2">
        <p className="text-sm font-medium">Environment</p>
        <form.Field name="environment">
          {(field) => (
            <div className="flex gap-2">
              {(['staging', 'production', 'all'] as const).map((env) => (
                <button
                  key={env}
                  type="button"
                  onClick={() => field.handleChange(env)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-xs font-medium capitalize transition-all',
                    field.state.value === env
                      ? env === 'production' || env === 'all' ? 'border-destructive bg-destructive/10 text-destructive' : 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {env}
                </button>
              ))}
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ControlledInput name="startTime" label="Start Time" type="datetime-local" required validators={{ onChange: maintenanceWindowSchema.shape.startTime }} />
        <ControlledInput name="endTime" label="End Time" type="datetime-local" required validators={{ onChange: maintenanceWindowSchema.shape.endTime }} />
      </div>

      <ControlledTextarea
        name="description"
        label="Description"
        placeholder="What maintenance is being performed?"
        required
        validators={{ onChange: maintenanceWindowSchema.shape.description }}
      />

      <div className="space-y-2">
        <p className="text-sm font-medium">Affected Services</p>
        <form.Field name="affectedServices">
          {(field) => {
            const selected: string[] = (field.state.value as string[]) || [];
            return (
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((svc) => {
                  const isSelected = selected.includes(svc);
                  return (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => {
                        const next = isSelected ? selected.filter((s) => s !== svc) : [...selected, svc];
                        field.handleChange(next);
                      }}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                        isSelected ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                      )}
                    >
                      {svc}
                    </button>
                  );
                })}
              </div>
            );
          }}
        </form.Field>
      </div>

      <ControlledCheckbox name="notifyUsers" label="Notify users via status page" />

      <ControlledTextarea
        name="rollbackPlan"
        label="Rollback Plan"
        placeholder="Steps to revert if something goes wrong…"
        description="Optional but recommended for production changes"
      />

      <FormButton className="w-full">Schedule Maintenance</FormButton>
    </Form>
  );
}
