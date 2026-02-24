'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { subscriptionSchema, type SubscriptionFormData } from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface SubscriptionFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: SubscriptionFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<SubscriptionFormData>;
  availableTopics?: string[];
}

const DEFAULT_TOPICS = ['Engineering', 'Design', 'AI/ML', 'Music', 'Career', 'Open Source'];

export function SubscriptionForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  availableTopics = DEFAULT_TOPICS,
}: SubscriptionFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
      email: '',
      frequency: 'weekly' as const,
      contentPreferences: [] as string[],
      ...defaultValues,
    } as SubscriptionFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = subscriptionSchema.parse(value);
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
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />
      <ControlledInput
        name="name"
        label="Your Name"
        placeholder="Aldrin Azucena"
        required
        validators={{ onChange: subscriptionSchema.shape.name }}
      />
      <ControlledInput
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        required
        validators={{ onChange: subscriptionSchema.shape.email }}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium">Topics of Interest</p>
        <div className="flex flex-wrap gap-2">
          {availableTopics.map((topic) => (
            <form.Field key={topic} name="contentPreferences">
              {(field) => {
                const isSelected = (field.state.value as string[])?.includes(topic);
                return (
                  <button
                    type="button"
                    onClick={() => {
                      const current = (field.state.value as string[]) ?? [];
                      field.handleChange(
                        isSelected ? current.filter((t) => t !== topic) : [...current, topic],
                      );
                    }}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background hover:border-primary/50',
                    )}
                  >
                    {topic}
                  </button>
                );
              }}
            </form.Field>
          ))}
        </div>
      </div>
      <FormButton className="w-full">Subscribe</FormButton>
    </Form>
  );
}
