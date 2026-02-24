'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { groupMeetingPollSchema, type GroupMeetingPollFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface GroupMeetingPollFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: GroupMeetingPollFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<GroupMeetingPollFormData>;
}

const VOTING_OPTIONS = [
  { value: 'first_available', label: 'First Available' },
  { value: 'majority', label: 'Majority Vote' },
  { value: 'unanimous', label: 'Unanimous' },
] as const;

export function GroupMeetingPollForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: GroupMeetingPollFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: '',
      description: '',
      proposedSlots: '',
      inviteeEmails: '',
      deadline: '',
      votingMethod: 'majority' as const,
      ...defaultValues,
    } as GroupMeetingPollFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = groupMeetingPollSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'meeting',
      title: 'Meeting Details',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput
            name="title"
            label="Meeting Title"
            placeholder="Q1 Planning Session"
            required
            validators={{ onChange: groupMeetingPollSchema.shape.title }}
          />
          <ControlledTextarea
            name="description"
            label="Description"
            placeholder="What is this meeting about?"
          />
          <ControlledTextarea
            name="proposedSlots"
            label="Proposed Time Slots"
            placeholder={'2024-03-15 2:00 PM EST\n2024-03-16 10:00 AM EST\n2024-03-17 3:00 PM EST'}
            description="Enter one date/time slot per line"
            required
            validators={{ onChange: groupMeetingPollSchema.shape.proposedSlots }}
          />
        </div>
      ),
    },
    {
      id: 'invitees',
      title: 'Invitees',
      component: (
        <div className="space-y-4">
          <ControlledTextarea
            name="inviteeEmails"
            label="Invitees"
            placeholder={'alice@example.com\nbob@example.com\ncarol@example.com'}
            description="One email address per line"
            required
            validators={{ onChange: groupMeetingPollSchema.shape.inviteeEmails }}
          />
          <ControlledInput
            name="deadline"
            label="Voting Deadline"
            type="date"
            required
            validators={{ onChange: groupMeetingPollSchema.shape.deadline }}
          />
          <div className="space-y-2">
            <p className="text-sm font-medium">Voting Method</p>
            <form.Field name="votingMethod">
              {(field) => (
                <div className="flex gap-2">
                  {VOTING_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.handleChange(value)}
                      className={cn(
                        'flex-1 rounded-md border px-2 py-2 text-xs font-medium transition-all',
                        field.state.value === value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      ),
    },
  ];

  return (
    <Form form={form} variant={variant} className={cn('max-w-lg', className)} onSubmit={(e) => e.preventDefault()}>
      <FormWizard steps={steps} onComplete={async () => { await form.handleSubmit(); }} showChallenge={false} />
    </Form>
  );
}
