'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { sponsorshipSchema, type SponsorshipFormData } from '../../schemas/index';
import { ControlledInput, ControlledTextarea } from '../fields';
import { FormButton } from '../../components/FormButton';
import { FormErrorSummary } from '../../components/FormErrorSummary';

export interface SponsorshipInquiryFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: SponsorshipFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<SponsorshipFormData>;
}

export function SponsorshipInquiryForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: SponsorshipInquiryFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      company: '',
      contactName: '',
      email: '',
      scope: 'custom' as const,
      audienceReach: '',
      budgetRange: '$500-$2k' as const,
      deliverables: '',
      campaignTimeline: '',
      ...defaultValues,
    } as SponsorshipFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = sponsorshipSchema.parse(value);
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
      className={cn('max-w-lg space-y-4', className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <FormErrorSummary />
      <ControlledInput
        name="company"
        label="Company"
        placeholder="Acme Corp"
        required
        validators={{ onChange: sponsorshipSchema.shape.company }}
      />
      <ControlledInput
        name="contactName"
        label="Contact Name"
        placeholder="Jane Smith"
        required
        validators={{ onChange: sponsorshipSchema.shape.contactName }}
      />
      <ControlledInput
        name="email"
        label="Email"
        type="email"
        placeholder="jane@acme.com"
        required
        validators={{ onChange: sponsorshipSchema.shape.email }}
      />
      <ControlledInput
        name="audienceReach"
        label="Audience Reach"
        placeholder="e.g. 10k monthly readers"
        required
        validators={{ onChange: sponsorshipSchema.shape.audienceReach }}
      />
      <ControlledInput
        name="campaignTimeline"
        label="Campaign Timeline"
        placeholder="e.g. Q1 2026, 3-month campaign"
        required
        validators={{ onChange: sponsorshipSchema.shape.campaignTimeline }}
      />
      <ControlledTextarea
        name="deliverables"
        label="Desired Deliverables"
        placeholder="Describe what you'd like to achieve…"
        required
        validators={{ onChange: sponsorshipSchema.shape.deliverables }}
      />
      <FormButton className="w-full">Submit Inquiry</FormButton>
    </Form>
  );
}
