'use client';

import * as React from 'react';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { Form } from '@aazucena/ui';
import { cn } from '@aazucena/utils';
import { addressSchema, type AddressFormData } from '../../schemas/index.js';
import { ControlledInput, ControlledCheckbox } from '../fields.js';
import { FormButton } from '../../components/FormButton.js';
import { FormErrorSummary } from '../../components/FormErrorSummary.js';

export interface AddressFormProps {
  variant?: 'default' | 'glass' | 'cyber';
  onSuccess?: (data: AddressFormData) => void;
  onError?: (error: unknown) => void;
  className?: string;
  defaultValues?: Partial<AddressFormData>;
  defaultMode?: 'autocomplete' | 'manual';
  /**
   * Render prop for the geocoding provider's autocomplete input.
   * Receives `onSelect` — call it with a partial AddressFormData when the user
   * picks a place. The form auto-fills the fields and switches to manual mode
   * so the user can review and correct before submitting.
   *
   * Provider mapping examples:
   *   Google Places → { line1, city, state, postalCode, country, placeId, formattedAddress,
   *                      source: 'google', geojson: { type: 'Point', coordinates: [lng, lat] } }
   *   Mapbox        → { line1, city, state, postalCode, country, placeId, formattedAddress,
   *                      source: 'mapbox', geojson: { type: 'Point', coordinates: [lng, lat] } }
   */
  autocompleteSlot?: (onSelect: (data: Partial<AddressFormData>) => void) => React.ReactNode;
}

const ADDRESS_TYPES = ['billing', 'shipping', 'home', 'work', 'other'] as const;

export function AddressForm({
  variant = 'default',
  onSuccess,
  onError,
  className,
  defaultValues,
  defaultMode,
  autocompleteSlot,
}: AddressFormProps) {
  const [mode, setMode] = React.useState<'autocomplete' | 'manual'>(
    defaultMode ?? (autocompleteSlot ? 'autocomplete' : 'manual'),
  );

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      fullName: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      type: 'home' as const,
      isDefault: false,
      placeId: '',
      formattedAddress: '',
      source: 'manual' as const,
      ...defaultValues,
    } as AddressFormData,
    onSubmit: async ({ value }: { value: any }) => {
      try {
        onSuccess?.(addressSchema.parse(value));
      } catch (error) {
        onError?.(error);
      }
    },
  } as any);

  const handleAutocompleteSelect = (data: Partial<AddressFormData>) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) (form as any).setFieldValue(key, value);
    });
    setMode('manual');
  };

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

      {/* Mode Toggle — only shown when autocompleteSlot is provided */}
      {autocompleteSlot && (
        <div className="flex gap-1 rounded-lg border border-border bg-muted/30 p-1">
          <button
            type="button"
            onClick={() => setMode('autocomplete')}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              mode === 'autocomplete'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            🔍 Search
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={cn(
              'flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              mode === 'manual'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            ✏️ Manual
          </button>
        </div>
      )}

      {/* Autocomplete Mode */}
      {mode === 'autocomplete' && autocompleteSlot && (
        <div className="space-y-3">
          <div className="rounded-md border border-border bg-muted/20 p-4">
            {autocompleteSlot(handleAutocompleteSelect)}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Can&apos;t find your address?{' '}
            <button
              type="button"
              onClick={() => setMode('manual')}
              className="text-primary underline underline-offset-2"
            >
              Switch to manual entry
            </button>
          </p>
        </div>
      )}

      {/* Manual Mode */}
      {mode === 'manual' && (
        <>
          {/* Address Type Picker */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Address Type</p>
            <form.Field name="type">
              {(field) => (
                <div className="flex flex-wrap gap-2">
                  {ADDRESS_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => field.handleChange(t)}
                      className={cn(
                        'rounded-md border px-3 py-1.5 text-xs font-medium capitalize transition-all',
                        field.state.value === t
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:border-primary/50',
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          {/* Contact */}
          <ControlledInput
            name="fullName"
            label="Full Name"
            placeholder="Aldrin Azucena"
            required
            autoComplete="name"
            validators={{ onChange: addressSchema.shape.fullName }}
          />
          <ControlledInput
            name="line1"
            label="Address Line 1"
            placeholder="123 Main Street"
            required
            autoComplete="address-line1"
            validators={{ onChange: addressSchema.shape.line1 }}
          />
          <ControlledInput
            name="line2"
            label="Address Line 2"
            placeholder="Apt 4B, Suite 100, Floor 3…"
            autoComplete="address-line2"
          />

          {/* City + Region */}
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput
              name="city"
              label="City"
              placeholder="San Francisco"
              required
              autoComplete="address-level2"
              validators={{ onChange: addressSchema.shape.city }}
            />
            <ControlledInput
              name="state"
              label="Region"
              placeholder="State / Province / Prefecture"
              autoComplete="address-level1"
            />
          </div>

          {/* Postal + Country */}
          <div className="grid grid-cols-2 gap-3">
            <ControlledInput
              name="postalCode"
              label="Postal / ZIP"
              placeholder="94105"
              autoComplete="postal-code"
            />
            <ControlledInput
              name="country"
              label="Country"
              placeholder="United States"
              required
              autoComplete="country-name"
              validators={{ onChange: addressSchema.shape.country }}
            />
          </div>

          {/* Phone */}
          <ControlledInput
            name="phone"
            label="Phone (optional)"
            placeholder="+1 (555) 000-0000"
            type="tel"
            autoComplete="tel"
          />

          {/* Default flag */}
          <ControlledCheckbox
            name="isDefault"
            label="Set as default address"
            description="Use this address as the default for billing and shipping"
          />

          <FormButton className="w-full">Save Address</FormButton>
        </>
      )}

      {/* Autocomplete mode — no submit button shown until user switches to manual */}
      {mode === 'autocomplete' && (
        <p className="text-center text-xs text-muted-foreground">
          Select an address above to continue
        </p>
      )}
    </Form>
  );
}
