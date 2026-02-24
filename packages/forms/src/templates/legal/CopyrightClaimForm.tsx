'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { copyrightClaimSchema, type CopyrightClaimFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledTextarea, ControlledCheckbox } from '../fields.js';
import { FormWizard } from '../../components/FormWizard.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface CopyrightClaimFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: CopyrightClaimFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<CopyrightClaimFormData>;
}

export function CopyrightClaimForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
}: CopyrightClaimFormProps) {
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      claimantName: '',
      claimantEmail: '',
      ownershipProof: '',
      infringingUrl: '',
      originalWorkUrl: '',
      goodFaithStatement: false,
      signature: '',
      ...defaultValues,
    } as CopyrightClaimFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        const validated = copyrightClaimSchema.parse(value);
        onSuccess?.(validated);
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const steps = [
    {
      id: 'claimant',
      title: 'Claimant Info',
      component: (
        <div className="space-y-4">
          <FormErrorSummary />
          <ControlledInput
            name="claimantName"
            label="Your Full Name"
            placeholder="Jane Smith"
            required
            validators={{ onChange: copyrightClaimSchema.shape.claimantName }}
          />
          <ControlledInput
            name="claimantEmail"
            label="Email Address"
            type="email"
            placeholder="jane@example.com"
            required
            validators={{ onChange: copyrightClaimSchema.shape.claimantEmail }}
          />
          <ControlledTextarea
            name="ownershipProof"
            label="Proof of Ownership"
            placeholder="Describe how you own this work — copyright registration number, creation date, publication history…"
            required
            validators={{ onChange: copyrightClaimSchema.shape.ownershipProof }}
          />
        </div>
      ),
    },
    {
      id: 'infringement',
      title: 'Infringement Details',
      component: (
        <div className="space-y-4">
          <ControlledInput
            name="infringingUrl"
            label="URL of Infringing Content"
            type="url"
            placeholder="https://example.com/infringing-page"
            required
            validators={{ onChange: copyrightClaimSchema.shape.infringingUrl }}
          />
          <ControlledInput
            name="originalWorkUrl"
            label="URL of Original Work"
            type="url"
            placeholder="https://yoursite.com/original-work"
          />
          <ControlledCheckbox
            name="goodFaithStatement"
            label="I have a good-faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law"
            required
          />
          <ControlledInput
            name="signature"
            label="Electronic Signature"
            placeholder="Type your full legal name"
            required
            validators={{ onChange: copyrightClaimSchema.shape.signature }}
          />
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
