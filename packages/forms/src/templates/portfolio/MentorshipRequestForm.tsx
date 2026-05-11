'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { mentorshipRequestSchema, type MentorshipRequestFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface MentorshipRequestFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: MentorshipRequestFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<MentorshipRequestFormData>;
  availableTopics?: string[];
}

const DEFAULT_TOPICS = [
  'TypeScript',
  'React',
  'Node.js',
  'System Design',
  'Career Growth',
  'Open Source',
  'AI/ML',
  'Music Production',
];

export function MentorshipRequestForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  availableTopics = DEFAULT_TOPICS,
}: MentorshipRequestFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      name: '',
      email: '',
      background: '',
      goals: '',
      format: '1:1 Video' as const,
      topics: [] as string[],
      commitmentLevel: '4-8 hrs/month' as const,
      ...defaultValues,
    } as MentorshipRequestFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(mentorshipRequestSchema.parse(value));
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
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />
      <div className="grid grid-cols-2 gap-3">
        <ControlledInput
          name="name"
          label="Name"
          placeholder="Aldrin Azucena"
          required
          validators={{ onChange: mentorshipRequestSchema.shape.name }}
        />
        <ControlledInput
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          validators={{ onChange: mentorshipRequestSchema.shape.email }}
        />
      </div>
      <ControlledTextarea
        name="background"
        label="Your Background"
        placeholder="Current role, experience level, what you're working on…"
        required
        validators={{ onChange: mentorshipRequestSchema.shape.background }}
      />
      <ControlledTextarea
        name="goals"
        label="Goals"
        placeholder="What do you want to achieve through mentorship?"
        required
        validators={{ onChange: mentorshipRequestSchema.shape.goals }}
      />
      <div className="space-y-2">
        <p className="text-sm font-medium">Topics of Interest</p>
        <div className="flex flex-wrap gap-2">
          {availableTopics.map((topic) => (
            <form.Field key={topic} name="topics">
              {(field) => {
                const isSelected = ((field.state.value as string[]) ?? []).includes(topic);
                return (
                  <button
                    type="button"
                    onClick={() => {
                      const cur = (field.state.value as string[]) ?? [];
                      field.handleChange(
                        isSelected ? cur.filter((t) => t !== topic) : [...cur, topic],
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
      <FormButton className="w-full">Request Mentorship</FormButton>
    </Form>
  );
}
