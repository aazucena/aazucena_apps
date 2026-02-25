'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import {
  affiliateApplicationSchema,
  type AffiliateApplicationFormData,
} from '../../schemas/index.js';
import { ControlledInput } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface AffiliateApplicationFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: AffiliateApplicationFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<AffiliateApplicationFormData>;
}

const PROMOTION_OPTIONS = [
  'blog_post',
  'video',
  'social_media',
  'email_newsletter',
  'podcast',
  'other',
];
const PROMOTION_LABELS: Record<string, string> = {
  blog_post: 'Blog Post',
  video: 'Video',
  social_media: 'Social Media',
  email_newsletter: 'Email Newsletter',
  podcast: 'Podcast',
  other: 'Other',
};
const PAYMENT_OPTIONS = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'stripe', label: 'Stripe' },
  { value: 'crypto', label: 'Crypto' },
] as const;

export function AffiliateApplicationForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: AffiliateApplicationFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      website: '',
      channel: '',
      audienceSize: '',
      niche: '',
      promotionMethods: [],
      paymentMethod: 'paypal' as const,
      taxInfo: '',
      ...defaultValues,
    } as AffiliateApplicationFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = affiliateApplicationSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'channel',
      title: 'Your Channel',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput
            name="channel"
            label="Channel / Platform"
            placeholder="e.g. YouTube, Blog, Twitter"
            required
            validators={{ onChange: affiliateApplicationSchema.shape.channel }}
          />
          <ControlledInput
            name="website"
            label="Website or Profile URL"
            type="url"
            placeholder="https://yourblog.com"
          />
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput
              name="audienceSize"
              label="Audience Size"
              placeholder="e.g. 10,000 subscribers"
              required
              validators={{ onChange: affiliateApplicationSchema.shape.audienceSize }}
            />
            <ControlledInput
              name="niche"
              label="Niche"
              placeholder="e.g. Developer Tools"
              required
              validators={{ onChange: affiliateApplicationSchema.shape.niche }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'commission',
      title: 'Commission Details',
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Promotion Methods</p>
            <form.Field name="promotionMethods">
              {(field) => {
                const selected: string[] = (field.state.value as string[]) || [];
                return (
                  <div className="flex flex-wrap gap-2">
                    {PROMOTION_OPTIONS.map((m) => {
                      const isSelected = selected.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => {
                            const next = isSelected
                              ? selected.filter((x) => x !== m)
                              : [...selected, m];
                            field.handleChange(next);
                          }}
                          className={cn(
                            'rounded-full border px-3 py-1 text-xs font-medium transition-all',
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border hover:border-primary/50',
                          )}
                        >
                          {PROMOTION_LABELS[m]}
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            </form.Field>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Payment Method</p>
            <form.Field name="paymentMethod">
              {(field) => (
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_OPTIONS.map(({ value, label }) => (
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
            name="taxInfo"
            label="Tax Information"
            placeholder="Tax ID / VAT Number"
            required
            validators={{ onChange: affiliateApplicationSchema.shape.taxInfo }}
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
